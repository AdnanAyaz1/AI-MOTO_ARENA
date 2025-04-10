"use server";

import { db } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";

interface BookTestDriveProps {
  carId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}: BookTestDriveProps) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return serverActionResponse(
        "You must be logged in to book a test drive",
        false,
        401
      );
    }

    // Check if car exists and is available
    const car = await db.car.findUnique({
      where: { id: carId, status: "AVAILABLE" },
    });

    if (!car) return serverActionResponse("No Car Found", false, 400);

    // Check if slot is already booked
    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking) {
      return serverActionResponse(
        "This time slot is already booked. Please select another time.",
        false,
        400
      );
    }

    // Create the booking
    const booking = await db.testDriveBooking.create({
      data: {
        carId,
        userId: user?.data?.id as string,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        notes: notes || null,
        status: "PENDING",
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/test-drive/${carId}`);
    revalidatePath(`/cars/${carId}`);

    return serverActionResponse("Test Drive Booked Successfully", true, 200);
  } catch (error) {
    return handleActionError(error);
  }
}

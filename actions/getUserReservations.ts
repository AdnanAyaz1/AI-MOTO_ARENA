"use server";
import { db } from "@/lib/prismadb";
import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { ExtendedTestDriveBooking } from "@/types/types";

export const getUserReservations = async (
  userId: string
): Promise<ServerActionResponse<ExtendedTestDriveBooking[]>> => {
  try {
    const testDriveBookings = await db.testDriveBooking.findMany({
      where: {
        userId,
      },
      include: {
        car: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize Decimal and Date values
    const serializedBookings = testDriveBookings.map((booking) => ({
      ...booking,
      car: {
        ...booking.car,
        price: booking.car.price.toString(),
        mileage: booking.car.mileage.toString(),
        createdAt: booking.car.createdAt.toISOString(),
        updatedAt: booking.car.updatedAt.toISOString(),
      },
      user: {
        ...booking.user,
        createdAt: booking.user.createdAt.toISOString(),
        updatedAt: booking.user.updatedAt.toISOString(),
      },
      bookingDate: booking.bookingDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return serverActionResponse(
      "Test Drive Bookings Fetched Successfully",
      true,
      200,
      serializedBookings
    );
  } catch (error) {
    return handleActionError(error);
  }
};

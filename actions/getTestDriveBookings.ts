"use server";
import { db } from "@/lib/prismadb";
import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { BookingStatus, Prisma, TestDriveBooking } from "@prisma/client";
import { ExtendedTestDriveBooking } from "@/types/types";

export const getTestDriveBookings = async (
  carId: string
): Promise<ServerActionResponse<TestDriveBooking[]>> => {
  try {
    const testDriveBookings = await db.testDriveBooking.findMany({
      where: {
        carId,
      },
    });
    return serverActionResponse(
      "Test Drive Bookings Fetched Successfully",
      true,
      200,
      testDriveBookings
    );
  } catch (error) {
    return handleActionError(error);
  }
};

export const getAdminTestDrives = async ({
  status,
  search,
}: {
  status: string;
  search: string;
}): Promise<ServerActionResponse<ExtendedTestDriveBooking[]>> => {
  try {
    const filterQuery: Prisma.TestDriveBookingWhereInput = {};

    if (search) {
      const searchTerms = search.split(" ").filter((term) => term.length > 0);
      filterQuery.OR = searchTerms.map((term) => ({
        OR: [
          { car: { company: { contains: term, mode: "insensitive" } } },
          { car: { model: { contains: term, mode: "insensitive" } } },
          { user: { email: { contains: term, mode: "insensitive" } } },
        ],
      }));
    }
    if (status) {
      filterQuery.status = status as BookingStatus;
    }
    const testDrives = await db.testDriveBooking.findMany({
      where: filterQuery,
      include: {
        car: true,
        user: true,
      },
    });

    // Serialize all data including arrays
    const serializedTestDrives = testDrives.map((testDrive) => ({
      ...testDrive,
      car: {
        ...testDrive.car,
        price: testDrive.car.price.toString(),
        mileage: testDrive.car.mileage.toString(),
        images: [...testDrive.car.images],
        createdAt: testDrive.car.createdAt.toISOString(),
        updatedAt: testDrive.car.updatedAt.toISOString(),
      },
      user: {
        ...testDrive.user,
        createdAt: testDrive.user.createdAt.toISOString(),
        updatedAt: testDrive.user.updatedAt.toISOString(),
      },
      bookingDate: testDrive.bookingDate.toISOString(),
      createdAt: testDrive.createdAt.toISOString(),
      updatedAt: testDrive.updatedAt.toISOString(),
    }));

    return serverActionResponse(
      "Test Drive Bookings Fetched Successfully",
      true,
      200,
      serializedTestDrives as ExtendedTestDriveBooking[]
    );
  } catch (error) {
    return handleActionError(error);
  }
};

"use server";

import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { db } from "@/lib/prismadb";

export const handleTestDriveStatus = async (
  bookingId: string,
  newStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
) => {
  try {
    const updatedBooking = await db.testDriveBooking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: newStatus,
      },
    });

    return serverActionResponse(
      "Test drive status updated successfully",
      true,
      200,
      updatedBooking
    );
  } catch (error) {
    return handleActionError(error);
  }
};

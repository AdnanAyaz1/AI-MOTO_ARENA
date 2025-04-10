"use server";

import { db } from "@/lib/prismadb";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";

export const isCarSaved = async (carId: string, userId: string) => {
  try {
    const savedCar = await db.userSavedCar.findFirst({
      where: {
        userId: userId,
        carId: carId,
      },
    });

    return serverActionResponse(
      "Car saved status checked successfully",
      true,
      200,
      !!savedCar
    );
  } catch (error) {
    return handleActionError(error);
  }
};

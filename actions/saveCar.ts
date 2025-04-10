"use server";

import { db } from "@/lib/prismadb";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { revalidatePath } from "next/cache";

export const saveCar = async (carId: string, userId: string) => {
  try {
    // Check if the car is already saved
    const existingSavedCar = await db.userSavedCar.findFirst({
      where: {
        userId: userId,
        carId: carId,
      },
    });

    if (existingSavedCar) {
      // If car is already saved, unsave it
      await db.userSavedCar.delete({
        where: {
          id: existingSavedCar.id,
        },
      });
      revalidatePath("/saved-cars");
      return serverActionResponse("Car unsaved successfully", true, 200, null);
    } else {
      // If car is not saved, save it
      const savedCar = await db.userSavedCar.create({
        data: {
          userId: userId,
          carId: carId,
        },
      });
      revalidatePath("/saved-cars");
      return serverActionResponse(
        "Car saved successfully",
        true,
        200,
        savedCar
      );
    }
  } catch (error) {
    return handleActionError(error);
  }
};

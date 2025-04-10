import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { ExtendedCar } from "@/types/types";

export const getCarById = async (
  id: string
): Promise<ServerActionResponse<ExtendedCar>> => {
  try {
    const car = await db.car.findUnique({
      where: { id },
      include: {
        savedBy: true,
      },
    });
    return serverActionResponse(
      "car fetched successfully",
      true,
      200,
      car as ExtendedCar
    );
  } catch (error) {
    return handleActionError(error);
  }
};

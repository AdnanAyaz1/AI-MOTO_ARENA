import { bodyType } from './../lib/constants';
"use server";

import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";

export const getBodyTypes = async (): Promise<ServerActionResponse<{bodyType: string, images: string[]}[]>> => {
  try {
    // select distinct body types from the cars table and pick an  image of the car
    const bodyTypes = await db.car.findMany({
      select: {
        bodyType: true,
        images: true,
      },
      distinct: ["bodyType"],
    });

    return serverActionResponse(
      "Body types fetched successfully",
      true,
      200,
      bodyTypes
    );
  } catch (error) {
    return handleActionError(error);
  }
};

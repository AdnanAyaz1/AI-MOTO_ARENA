"use server";

import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { DealershipInfo, WorkingHour } from "@prisma/client/edge";

export const getDealerInfo = async (): Promise<
  ServerActionResponse<
    (DealershipInfo & { workingHours: WorkingHour[] }) | null
  >
> => {
  try {
    const dealerInfo = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    if (!dealerInfo) {
      return serverActionResponse("No dealer info found", false, 404, null);
    }

    return serverActionResponse(
      "Dealer info fetched successfully",
      true,
      200,
      dealerInfo
    );
  } catch (error) {
    return handleActionError(error);
  }
};

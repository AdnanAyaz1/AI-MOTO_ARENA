"use server";
import { auth } from "@/auth";
import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { DealershipInfo, WorkingHour } from "@prisma/client/edge";
export default async function getDealershipInfo(): Promise<
  ServerActionResponse<
    | (DealershipInfo & {
        workingHours: WorkingHour[];
      })
    | null
  >
> {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) return serverActionResponse("Unauthorized", false, 401);

    // Get the dealership record
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    // If no dealership exists, create a default one
    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          // Default values will be used from schema
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "10:00",
                closeTime: "16:00",
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "10:00",
                closeTime: "16:00",
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

    // Format the data
    return serverActionResponse(
      "Dealership info fetched successfully",
      true,
      200,
      dealership
    );
  } catch (error) {
    return handleActionError(error);
  }
}

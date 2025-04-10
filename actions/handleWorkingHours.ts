"use server";
import { auth } from "@/auth";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { WorkingHour } from "@prisma/client/edge";
import { revalidatePath } from "next/cache";

export async function saveWorkingHours(workingHours: WorkingHour[]) {
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) return serverActionResponse("Unauthorized", false, 401);

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user || user.role !== "ADMIN") {
      return serverActionResponse(
        "Unauthorized: Admin access required",
        false,
        401
      );
    }

    // Get current dealership info
    const dealership = await db.dealershipInfo.findFirst();

    if (!dealership) {
      return serverActionResponse("Dealership info not found", false, 404);
    }

    // Update working hours - first delete existing hours
    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });

    // Then create new hours

    await db.workingHour.createMany({
      data: workingHours,
    });

    // Revalidate paths
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Homepage might display hours

    return serverActionResponse("Working hours saved successfully", true, 200);
  } catch (error) {
    return handleActionError(error);
  }
}

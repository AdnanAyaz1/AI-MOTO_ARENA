"use server";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (
  userId: string,
  role: "ADMIN" | "USER"
) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });
    revalidatePath("/admin/settings");
    return serverActionResponse(
      "User role updated successfully",
      true,
      201,
      updatedUser
    );
  } catch (error) {
    return handleActionError(error);
  }
};

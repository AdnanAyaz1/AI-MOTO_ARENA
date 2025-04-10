"use server";
import { auth } from "@/auth";
import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { User } from "@prisma/client/edge";

export const getCurrentUser = async (): Promise<
  ServerActionResponse<User | null>
> => {
  try {
    const session = await auth();
    if (!session) {
      return serverActionResponse(
        "You need to login to perform this action",
        false,
        400,
        null
      );
    }
    const user = await db.user.findUnique({
      where: { id: session?.user?.id },
    });
    return serverActionResponse("User fetched successfully", true, 200, user);
  } catch (error) {
    return handleActionError(error);
  }
};

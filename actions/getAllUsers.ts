"use server";
import { auth } from "@/auth";
import { db } from "@/lib/prismadb";
import { serverActionResponse } from "@/lib/action-utils";

export const getAllUser = async () => {
  const session = await auth();
  if (!session) {
    return serverActionResponse("Unauthorized", false, 401);
  }
  const users = await db.user.findMany();
  return serverActionResponse("Users fetched successfully", true, 200, users);
};

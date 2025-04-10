import { apiResponse, handleApiError } from "@/lib/api-utils";
import { db } from "@/lib/prismadb";

export async function POST(req: Request) {
  const { username } = await req.json();
  console.log("username", username);
  try {
    const existingUser = await db.user.findUnique({
      where: {
        username,
      },
    });

    console.log("existingUser", existingUser);

    if (existingUser) {
      return apiResponse(`${username} is not available.`, false, 409);
    }

    return apiResponse(`${username} is available.`, true, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

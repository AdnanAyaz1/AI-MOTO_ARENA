import { apiResponse, handleApiError } from "@/lib/api-utils";
import { db } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { id, username, image } = await req.json();

    //Update user in the database
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        username,
        imageUrl: image,
      },
    });

    return apiResponse("User Updated", true, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

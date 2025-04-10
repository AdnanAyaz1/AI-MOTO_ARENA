import { db } from "@/lib/prismadb";
import { apiResponse, handleApiError } from "@/lib/api-utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Extract 'id' from params
    if (!id) return apiResponse("User ID is required", false, 400);

    const user = await db.user.findUnique({ where: { id } });
    if (!user) return apiResponse("User not found", false, 404);

    return apiResponse("User fetched successfully", true, 200, user);
  } catch (error) {
    return handleApiError(error);
  }
}

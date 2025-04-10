import bcrypt from "bcryptjs";

import { db } from "@/lib/prismadb";
import { extractErrorMessages } from "@/lib/utils";
import { signUpSchemaApi } from "@/lib/zod-validation-schemas";
import { apiResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  try {
    // Validate the data using Zod schema
    const validatedData = signUpSchemaApi.safeParse({
      username,
      email,
      password,
    });

    if (!validatedData.success) {
      const message = extractErrorMessages(
        validatedData.error.flatten().fieldErrors
      );
      return apiResponse(message, false, 400);
    }

    // Check if the user already exists based on email
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return apiResponse("User with this email already exists.", false, 409); // 409 Conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return apiResponse("Registration Successful", true, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

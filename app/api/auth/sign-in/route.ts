import bcrypt from "bcryptjs";

import { extractErrorMessages } from "@/lib/utils";
import { signInSchema } from "@/lib/zod-validation-schemas";
import { apiResponse, handleApiError } from "@/lib/api-utils";
import { db } from "@/lib/prismadb";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const validatedData = signInSchema.safeParse({
      email,
      password,
    });

    if (!validatedData.success) {
      const message = extractErrorMessages(
        validatedData.error.flatten().fieldErrors
      );
      return apiResponse(message, false, 400);
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    let isValid: boolean | Promise<boolean> = false;
    if (existingUser)
      isValid = await bcrypt.compare(
        password,
        existingUser?.password as string
      );

    if (existingUser && isValid) {
      return apiResponse("Registration Successfull", true, 200);
    } else {
      return apiResponse("Invalid Email or Password", false, 400);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

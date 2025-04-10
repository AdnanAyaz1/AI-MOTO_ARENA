import { NextResponse } from "next/server";

export const apiResponse = <T>(
  message: string,
  success: boolean,
  status: number,
  data?: T
): NextResponse => {
  return NextResponse.json({
    message,
    success,
    status,
    data,
  });
};

export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return apiResponse(error.message, false, 500);
  }
  return apiResponse("An unexpected error occurred", false, 500);
};


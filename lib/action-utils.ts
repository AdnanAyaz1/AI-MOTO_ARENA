import { toast } from "react-toastify";

export type ServerActionResponse<T = undefined> = {
  message: string;
  success: boolean;
  status: number;
  data?: T;
  noOfPages?: number;
};

export const serverActionResponse = <T>(
  message: string,
  success: boolean,
  status: number,
  data?: T,
  noOfPages?: number
): ServerActionResponse<T> => {
  return {
    message,
    success,
    status,
    data,
    noOfPages,
  };
};

export const handleServerActionResponse = <T>(
  response: ServerActionResponse<T> | null
) => {
  if (!response) {
    toast.error("An unexpected error occurred");
    return;
  }

  if (response.success) {
    toast.success(response.message);
    return response.data;
  } else {
    toast.error(response.message);
    return;
  }
};

export const handleActionError = <T>(
  error: unknown
): ServerActionResponse<T> => {
  if (error instanceof Error) {
    return serverActionResponse(error.message, false, 500);
  }
  return serverActionResponse("An unexpected error occurred", false, 500);
};

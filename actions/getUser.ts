import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prismadb";

interface Props {
  protectedRoute?: boolean;
}

export const getUser = async ({ protectedRoute = false }: Props = {}) => {
  const session = await auth();
  if (!session) {
    if (protectedRoute) {
      redirect("/sign-in");
    }
    return null;
  }
  const user = await db.user.findUnique({
    where: { id: session?.user?.id },
  });
  return user;
};

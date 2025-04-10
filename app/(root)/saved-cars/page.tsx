import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/prismadb";
import { SavedCarsList } from "@/components/SavedCars";
import { Car } from "@prisma/client";

const SavedCars = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const cars = await db.car.findMany({
    where: {
      savedBy: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      savedBy: true,
    },
  });
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12 mt-20">
      <h1 className="text-4xl mb-6 gradient-title">Your Saved Cars</h1>
      <SavedCarsList initialData={cars} />
    </div>
  );
};

export default SavedCars;

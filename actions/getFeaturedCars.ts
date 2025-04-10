import { db } from "@/lib/prismadb";

export const getFeaturedCars = async () => {
  const cars = await db.car.findMany({
    where: {
      featured: true,
    },
    include: {
      savedBy: true,
    },
  });
  return cars;
};

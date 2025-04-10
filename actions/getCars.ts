"use server";

import { db } from "@/lib/prismadb";

export const getCars = async () => {
  const cars = await db.car.findMany();
  return cars;
};

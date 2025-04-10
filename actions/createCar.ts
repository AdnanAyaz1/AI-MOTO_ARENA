"use server";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { extractErrorMessages } from "@/lib/utils";

import { carFormSchema } from "@/lib/zod-validation-schemas";
import { z } from "zod";

export default async function createCar(values: z.infer<typeof carFormSchema>) {
  const {
    company,
    model,
    year,
    price,
    mileage,
    color,
    fuelType,
    transmission,
    bodyType,
    seats,
    description,
    featured,
    images,
  } = values;
  // validate the form
  const validatedFields = carFormSchema.safeParse(values);
  if (!validatedFields.success) {
    const message = extractErrorMessages(
      validatedFields.error.flatten().fieldErrors
    );
    return serverActionResponse(message, false, 400);
  }

  try {
    // create the car
    const car = await db.car.create({
      data: {
        company,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        mileage: parseInt(mileage),
        color,
        fuelType,
        transmission,
        bodyType,
        seats: seats ? parseInt(seats) : null,
        description,
        featured,
        images,
      },
    });
    return serverActionResponse("Car created successfully", true, 201, car);
  } catch (error) {
    return handleActionError(error);
  }
}

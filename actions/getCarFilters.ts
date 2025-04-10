import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { db } from "@/lib/prismadb";

export async function getCarFilters() {
  try {
    // Get unique makes
    const makes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { company: true },
      distinct: ["company"],
      orderBy: { company: "asc" },
    });

    // Get unique body types
    const bodyTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    // Get unique fuel types
    const fuelTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // Get unique transmissions
    const transmissions = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // Get min and max prices using Prisma aggregations
    const priceAggregations = await db.car.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return serverActionResponse("", true, 200, {
      company: makes.map((item) => item.company),
      bodyTypes: bodyTypes.map((item) => item.bodyType),
      fuelTypes: fuelTypes.map((item) => item.fuelType),
      transmissions: transmissions.map((item) => item.transmission),
      priceRange: {
        min: priceAggregations._min.price
          ? parseFloat(priceAggregations._min.price.toString())
          : 0,
        max: priceAggregations._max.price
          ? parseFloat(priceAggregations._max.price.toString())
          : 100000,
      },
    });
  } catch (error) {
    return handleActionError(error);
  }
}

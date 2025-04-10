// company, bodyType, fuelType, transmission, minPrice, maxPrice, sort, page;

import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { serializeCarData } from "@/lib/utils";
import { Car, Prisma } from "@prisma/client/edge";

// Define a type for the serialized car data
type SerializedCar = Omit<Car, "price" | "mileage"> & {
  price: string;
  mileage: string;
};

export async function getFilteredCars(params: {
  company?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  search?: string;
}): Promise<ServerActionResponse<SerializedCar[]>> {
  try {
    const {
      company,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      search,
    } = params;

    const pageSize = 6;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const filterQuery: Prisma.CarWhereInput = {};
    filterQuery.status = "AVAILABLE";

    if (search) {
      const searchTerms = search.split(" ").filter((term) => term.length > 0);
      filterQuery.OR = searchTerms.map((term) => ({
        OR: [
          { company: { contains: term, mode: "insensitive" } },
          { model: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      }));
    }

    if (company) {
      filterQuery.company = { equals: company, mode: "insensitive" };
    }

    if (bodyType)
      filterQuery.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType)
      filterQuery.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      filterQuery.transmission = { equals: transmission, mode: "insensitive" };

    // Add price range filters
    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) {
        filterQuery.price.gte = minPrice;
      }
      if (maxPrice) {
        filterQuery.price.lte = maxPrice;
      }
    }

    // Determine sort order
    let sortCriteria: Prisma.CarOrderByWithRelationInput = {};
    switch (sort) {
      case "priceAsc":
        sortCriteria = { price: "asc" };
        break;
      case "priceDesc":
        sortCriteria = { price: "desc" };
        break;
      case "newest":
      default:
        sortCriteria = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCars = await db.car.count({ where: filterQuery });

    const noOfPages = Math.ceil(totalCars / limit);

    // Execute the main query
    const cars = await db.car.findMany({
      where: filterQuery,
      take: limit,
      skip,
      orderBy: sortCriteria,
      include: {
        savedBy: true,
      },
    });

    // Convert Decimal values to strings
    const serializedCars = cars.map((car) => ({
      ...car,
      price: car.price.toString(),
      mileage: car.mileage.toString(),
    }));

    return serverActionResponse(
      "Cars fetched successfully",
      true,
      200,
      serializedCars,
      noOfPages
    );
  } catch (error) {
    return handleActionError(error);
  }
}

import { getCarFilters } from "@/actions/getCarFilters";
import { getFilteredCars } from "@/actions/getFilteredCars";
import CarCard from "@/components/Cards/CarCard";
import EmptyState from "@/components/EmptyState";
import React from "react";
import { PaginationComponent } from "@/components/Pagination";
import { ExtendedCar } from "@/types/types";
import CarFiltersWithClear from "@/components/Filters/CarFiltersWithClear";
import { CarFiltersProps } from "@/components/Filters/CarFilters";
import ClearSearchButtons from "@/components/Filters/ClearSearchButtons";

export interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Cars = async ({ searchParams }: SearchParams) => {
  const {
    company,
    bodyType,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    sort,
    search,
    page = "1",
  } = await searchParams;

  const { data } = await getCarFilters();
  const {
    data: cars,
    noOfPages,
    success,
  } = await getFilteredCars({
    company,
    bodyType,
    fuelType,
    transmission,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    sort: sort || "newest",
    page: Number(page),
    search: search,
  });

  return (
    <div className=" px-4 py-20 max-w-[1440px] mx-auto">
      <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <CarFiltersWithClear
            filters={data as CarFiltersProps}
            search={search || ""}
          />
        </div>

        {/* Car Listings */}
        <div className="flex-1">
          {search && cars && cars.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">
                No matching cars found
              </h3>
              <p className="text-gray-600 mb-4">
                No cars match your search for "{search}" with the current
                filters. Try adjusting your search or filters to find what
                you're looking for.
              </p>
              <ClearSearchButtons search={search} />
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car as ExtendedCar} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
      {noOfPages && noOfPages > 1 ? (
        <PaginationComponent noOfPages={noOfPages} />
      ) : null}
    </div>
  );
};

export default Cars;

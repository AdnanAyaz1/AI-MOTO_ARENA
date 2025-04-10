"use client";

import CarCard from "@/components/Cards/CarCard";
import EmptyState from "@/components/EmptyState";
import { ExtendedCar } from "@/types/types";

interface CarListingsProps {
  cars: ExtendedCar[];
}

const CarListings = ({ cars }: CarListingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars && cars.length > 0 ? (
        cars.map((car) => <CarCard key={car.id} car={car} />)
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default CarListings;

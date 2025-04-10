"use client";

import CarCard from "@/components/Cards/CarCard";
import CarCardSkeleton from "@/components/FeaturedCars/CarCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { Car } from "@prisma/client/edge";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CarListingsProps {
  initialCars: Car[];
}

const CarListings = ({ initialCars }: CarListingsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState(initialCars);

  // This will be called when filters change
  const handleFilterChange = () => {
    setIsLoading(true);
    // The actual data fetching is handled by the server component
    // This just shows the loading state
  };

  // Listen for route changes to show loading state
  const handleRouteChange = () => {
    setIsLoading(true);
  };

  // Reset loading state when new data arrives
  if (isLoading && cars !== initialCars) {
    setCars(initialCars);
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <>
          <CarCardSkeleton />
          <CarCardSkeleton />
          <CarCardSkeleton />
          <CarCardSkeleton />
          <CarCardSkeleton />
          <CarCardSkeleton />
        </>
      ) : cars && cars.length > 0 ? (
        cars.map((car) => <CarCard key={car.id} car={car} />)
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default CarListings;

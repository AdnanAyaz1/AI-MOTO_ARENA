import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Car } from "@prisma/client/edge";
import Link from "next/link";
import { getFeaturedCars } from "@/actions/getFeaturedCars";
import CarCard from "@/components/Cards/CarCard";

const FeaturedCars = async () => {
  let featuredCars = await getFeaturedCars();
  featuredCars = JSON.parse(JSON.stringify(featuredCars));
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Cars</h2>
          <Button variant="secondary">
            <Link href="/cars" className="text-black flex items-center gap-1">
              <p>View All</p> <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car as unknown as Partial<Car>} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;

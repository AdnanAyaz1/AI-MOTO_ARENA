import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedCar } from "@/types/types";
import { CarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import ToggleCar from "../Buttons/ToggleCar";
import Link from "next/link";
import CarCardImage from "../CardImages/CarCardImage";
const CarCard = ({ car }: { car: ExtendedCar }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group pt-0 pb-1 rounded-lg border-0">
      <div className="relative border-b-[1px] border-gray-400 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <CarCardImage images={car.images} />
        ) : (
          <div className="w-full h-[160px] bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <ToggleCar car={car} />
      </div>

      <CardContent className="p-3">
        <div className="flex flex-col mb-1.5">
          <h3 className="text-base font-bold line-clamp-1">
            {car.company} {car.model}
          </h3>
          <span className="text-lg font-bold text-blue-600">
            ${car?.price?.toLocaleString()}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-1.5 flex items-center">
          <span>{car.year}</span>
          <span className="mx-1.5">•</span>
          <span>{car.transmission}</span>
          <span className="mx-1.5">•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="bg-gray-50 text-xs">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-xs">
            {car?.mileage?.toLocaleString()} miles
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-xs">
            {car.color}
          </Badge>
        </div>

        <div className="flex justify-between">
          <Link
            className="flex-1 h-8 text-sm bg-black text-white rounded-md flex items-center justify-center hover:opacity-80 transition-all"
            href={`/cars/${car.id}`}
          >
            View Car
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;

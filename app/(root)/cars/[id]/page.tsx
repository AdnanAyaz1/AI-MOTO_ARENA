import { getCarById } from "@/actions/getCarById";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatTimeToAMPM } from "@/lib/utils";
import { Car, Gauge, Fuel, MessageSquare, LocateFixed } from "lucide-react";
import React from "react";
import CarImageGallery from "@/components/CarImageGallery";
import { notFound } from "next/navigation";
import TestDriveButton from "@/components/Buttons/TestDriveButton";
import { getDealerInfo } from "@/actions/getDealerInfo";
import { getTestDriveBookings } from "@/actions/getTestDriveBookings";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { TestDriveBooking, User } from "@prisma/client";

interface CarPageProps {
  params: {
    id: string;
  };
}

const CarPage = async ({ params }: CarPageProps) => {
  const { data: car } = await getCarById(params.id);
  const { data: dealerInfo } = await getDealerInfo();
  const { data: testDriveBookings } = await getTestDriveBookings(params.id);
  const { data: user } = await getCurrentUser();

  if (!car) {
    notFound();
  }
  return (
    <div className="max-w-[1440px] mx-auto px-4 mt-20 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          <CarImageGallery car={car} />
        </div>
        <div>
          <div className="w-full lg:w-[70%] space-y-4">
            <div className="mb-2 px-4 py-0.5 text-sm bg-black text-white rounded-full w-fit">
              <p>{car.bodyType}</p>
            </div>

            <h1 className="text-4xl font-bold mb-1">
              {car.year} {car.company} {car.model}
            </h1>

            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(Number(car.price))}
            </div>

            {/* Quick Stats */}
            <div className="flex  justify-between gap-4 my-6">
              <div className="flex items-center gap-2">
                <Gauge className="text-gray-700 h-6 w-6" />
                <span className="text-gray-600 font-medium">{car.mileage.toLocaleString()} miles</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="text-gray-700 h-6 w-6" />
                <span className="text-gray-600 font-medium">{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="text-gray-700 h-6 w-6" />
                <span className="text-gray-600 font-medium">{car.transmission}</span>
              </div>
            </div>
          </div>
          <Card className="my-6 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Have Questions?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our representatives are available to answer all your queries
                about this vehicle.
              </p>
              <a href="mailto:help@vehiql.in">
                <Button variant="secondary" className="w-full">
                  Request Info
                </Button>
              </a>
            </CardContent>
          </Card>
          {/* Test Drive Button */}
          <TestDriveButton
            carId={car.id}
            user={user as User}
            testDriveBookings={testDriveBookings as TestDriveBooking[]}
          />
        </div>
      </div>
      {/* Details & Features Section */}
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Description</h3>
            <p className="whitespace-pre-line text-gray-700 font-medium">
              {car.description}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">Features</h3>
            <ul className="grid grid-cols-1 gap-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full font-medium"></span>
                {car.transmission} Transmission
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full font-medium"></span>
                {car.fuelType} Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full font-medium"></span>
                {car.bodyType} Body Style
              </li>
              {car.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full font-medium"></span>
                  {car.seats} Seats
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full font-medium"></span>
                {car.color} Exterior
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Comapny</span>
              <span className="font-semibold">{car.company}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Model</span>
              <span className="font-semibold">{car.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Year</span>
              <span className="font-semibold">{car.year}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Body Type</span>
              <span className="font-semibold">{car.bodyType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Fuel Type</span>
              <span className="font-semibold">{car.fuelType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Transmission</span>
              <span className="font-semibold">{car.transmission}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Mileage</span>
              <span className="font-semibold">
                {car.mileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 font-semibold">Color</span>
              <span className="font-semibold">{car.color}</span>
            </div>
            {car.seats && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 font-semibold">Seats</span>
                <span className="font-semibold">{car.seats}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Dealer Info */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Dealer's Location</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Dealership Name and Address */}
            <div className="flex items-start gap-3">
              <LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">{dealerInfo?.name}</h4>
                <p className="text-gray-600 font-medium">
                  {dealerInfo?.address || "Not Available"}
                </p>
                <p className="text-gray-600 mt-1 font-medium">
                  Phone: {dealerInfo?.phone || "Not Available"}
                </p>
                <p className="text-gray-600 font-medium">
                  Email: {dealerInfo?.email || "Not Available"}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="md:w-1/2 lg:w-1/3 ">
              <h4 className="font-bold text-lg mb-2 ">Working Hours</h4>
              {dealerInfo?.workingHours.map((workingHour) => {
                return (
                  <div
                    key={workingHour.id}
                    className="flex items-center gap-2 justify-between"
                  >
                    <p className="font-medium text-sm">
                      {workingHour.dayOfWeek}
                    </p>
                    {workingHour.isClosed ? (
                      <p className="font-medium text-sm">Closed</p>
                    ) : (
                      <div className="flex items-center gap-2 font-medium">
                        <p className="text-sm">
                          {formatTimeToAMPM(workingHour.openTime)}
                        </p>
                        <p>-</p>
                        <p className="text-sm">
                          {formatTimeToAMPM(workingHour.closeTime)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPage;

import React from "react";
import { getCarById } from "@/actions/getCarById";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Car, CheckCircle2 } from "lucide-react";
import { getDealerInfo } from "@/actions/getDealerInfo";
import TestDriveForm from "@/components/Forms/TestDriveForm";
import { DealershipInfo, TestDriveBooking } from "@prisma/client/edge";
import { ExtendedDelaersInfo } from "@/types/types";
import { getTestDriveBookings } from "@/actions/getTestDriveBookings";
const TestDrivePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: car } = await getCarById(id);
  const { data: dealer } = await getDealerInfo();
  const { data: testDriveBookings } = await getTestDriveBookings(id);
  return (
    <div className="max-w-[1440px] mx-auto px-4 mt-20 py-8">
      <h1 className="text-4xl mb-6 gradient-title">Book a Test Drive</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card className="p-2 px-0">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Car Details</h2>

              <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
                {car && car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.company} ${car.model}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Car className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold">
                {car?.year} {car?.company} {car?.model}
              </h3>

              <div className="mt-2 text-xl font-bold text-blue-600">
                ${car?.price.toLocaleString()}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div className="flex justify-between py-1 border-b">
                  <span>Mileage</span>
                  <span className="font-medium">
                    {car?.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Fuel Type</span>
                  <span className="font-medium">{car?.fuelType}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Transmission</span>
                  <span className="font-medium">{car?.transmission}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Body Type</span>
                  <span className="font-medium">{car?.bodyType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Color</span>
                  <span className="font-medium">{car?.color}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dealership Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Dealers Info</h2>
              <div className="text-sm">
                <p className="font-medium">{dealer?.name || "Vehiql Motors"}</p>
                <p className="text-gray-600 mt-1">
                  {dealer?.address || "Address not available"}
                </p>
                <p className="text-gray-600 mt-3">
                  <span className="font-medium">Phone:</span>{" "}
                  {dealer?.phone || "Not available"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {dealer?.email || "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Book a Test Drive</h2>
          <TestDriveForm
            dealersInfo={dealer as ExtendedDelaersInfo}
            carId={id}
            testDriveBookings={testDriveBookings as TestDriveBooking[]}
          />
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What to expect</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Bring your driver's license for verification
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Test drives typically last 30-60 minutes
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />A
                dealership representative will accompany you
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDrivePage;

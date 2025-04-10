"use client";
import React from "react";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TestDriveBooking, User } from "@prisma/client";
import { format } from "date-fns";

const TestDriveButton = ({
  carId,
  user,
  testDriveBookings,
}: {
  carId: string;
  user: User;
  testDriveBookings: TestDriveBooking[];
}) => {
  const router = useRouter();

  const handleBookTestDrive = async () => {
    if (!user) toast.error("Please sign in to book a test drive");
    router.push(`/test-drive/${carId}`);
  };

  const isBooked = testDriveBookings.some(
    (booking) => booking.userId === user?.id
  );

  return (
    <Button
      className="w-full py-6 text-lg"
      onClick={handleBookTestDrive}
      disabled={isBooked}
    >
      <Calendar className="mr-2 h-5 w-5" />
      {isBooked
        ? `Booked for ${format(
            new Date(testDriveBookings[0].bookingDate),
            "EEEE, MMMM d, yyyy"
          )}`
        : "Book Test Drive"}
    </Button>
  );
};

export default TestDriveButton;

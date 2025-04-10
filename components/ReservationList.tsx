"use client";
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { TestDriveCard } from "./Cards/TestDriveCard";
import { ExtendedTestDriveBooking } from "@/types/types";
import { toast } from "react-toastify";
import { handleTestDriveStatus } from "@/actions/handleTestDriveStatus";
import { useRouter } from "next/navigation";
const ReservationList = ({
  initialData,
}: {
  initialData: ExtendedTestDriveBooking[];
}) => {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(true);
    const res = await handleTestDriveStatus(bookingId, "CANCELLED");
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setCancelling(false);
  };

  // Group bookings by status
  const upcomingBookings = initialData?.filter((booking) =>
    ["PENDING", "CONFIRMED"].includes(booking.status)
  );

  const pastBookings = initialData?.filter((booking) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(booking.status)
  );

  // No reservations
  if (initialData?.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Reservations Found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You don't have any test drive reservations yet. Browse our cars and
          book a test drive to get started.
        </p>
        <Button variant="default" asChild>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Test Drives</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming test drives.</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancelling}
                showActions
                cancelError={cancelError}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Test Drives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                showActions={false}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;

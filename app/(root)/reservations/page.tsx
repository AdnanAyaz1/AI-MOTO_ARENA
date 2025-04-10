import { getUserReservations } from "@/actions/getUserReservations";
import { auth } from "@/auth";
import ReservationList from "@/components/ReservationList";
import { redirect } from "next/navigation";
import React from "react";
import { ExtendedTestDriveBooking } from "@/types/types";

const Reservations = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in?redirect=/reservations");
  }
  const {data : userTestDrives} = await getUserReservations(session?.user?.id as string);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12 mt-20">
      <h1 className="text-4xl mb-6 gradient-title">Your Reservations</h1>
      <ReservationList initialData={userTestDrives as ExtendedTestDriveBooking[]} />
    </div>
  );
};

export default Reservations;

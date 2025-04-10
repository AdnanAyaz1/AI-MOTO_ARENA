import { getAdminTestDrives } from "@/actions/getTestDriveBookings";
import { SearchParams } from "@/app/(root)/cars/page";
import { TestDrivesList } from "@/components/TestDriveList";
import { ExtendedTestDriveBooking } from "@/types/types";
import React from "react";

const TestDrives = async ({ searchParams }: SearchParams) => {
  const { status,search } = await searchParams;
  const { data: testDrives, success } = await getAdminTestDrives({status,search});
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
      <TestDrivesList
        testDrives={testDrives as ExtendedTestDriveBooking[]}
        success={success}
      />
    </div>
  );
};

export default TestDrives;

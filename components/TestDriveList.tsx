"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search, Loader2, CalendarRange, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestDriveCard } from "@/components/Cards/TestDriveCard";
import { ExtendedTestDriveBooking } from "@/types/types";
import { handleTestDriveStatus } from "@/actions/handleTestDriveStatus";
import { useRouter, useSearchParams } from "next/navigation";
export const TestDrivesList = ({
  testDrives,
  success,
}: {
  testDrives: ExtendedTestDriveBooking[];
  success: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFilter("search", search);
  };

  useEffect(() => {
    setTimeout(() => {
      handleFilter("search", search);
    }, 300);
  }, [search]);

  const handleFilter = (type: string, value: string) => {
    if (type === "status") setStatusFilter(value);

    if (value === "all") {
      params.delete(type);
    } else if (value === "") {
      params.delete(type);
    } else if (params.get(type) !== value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle status update
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus(true);
    if (newStatus) {
      const res = await handleTestDriveStatus(
        bookingId,
        newStatus as
          | "PENDING"
          | "CONFIRMED"
          | "COMPLETED"
          | "CANCELLED"
          | "NO_SHOW"
      );
      if (res?.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update test drive status");
      }
      setUpdatingStatus(false);
    }
  };

  // Handle booking cancellation
  const handleCancel = async (bookingId: string) => {
    setCancelling(true);
    const res = await handleTestDriveStatus(bookingId, "CANCELLED");
    if (res?.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res?.message || "Failed to cancel test drive");
    }
    setCancelling(false);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => handleFilter("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by car or customer..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Test Drives List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            Test Drive Bookings
          </CardTitle>
          <CardDescription>
            Manage all test drive reservations and update their status
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!success ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load test drives. Please try again.
              </AlertDescription>
            </Alert>
          ) : testDrives?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CalendarRange className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No test drives found
              </h3>
              <p className="text-gray-500 mb-4">
                {statusFilter || search
                  ? "No test drives match your search criteria"
                  : "There are no test drive bookings yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {testDrives?.map((booking) => (
                <div key={booking.id} className="relative">
                  <TestDriveCard
                    booking={booking}
                    onCancel={handleCancel}
                    showActions={["PENDING", "CONFIRMED"].includes(
                      booking.status
                    )}
                    isAdmin={true}
                    isCancelling={cancelling}
                    cancelError={cancelError}
                    renderStatusSelector={() => (
                      <Select
                        value={booking.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(booking.id, value)
                        }
                        disabled={updatingStatus}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="NO_SHOW">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

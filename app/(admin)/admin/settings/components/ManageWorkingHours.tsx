"use client";
import getDealershipInfo from "@/actions/createDealerShip";
import { saveWorkingHours } from "@/actions/handleWorkingHours";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { WorkingHour } from "@prisma/client/edge";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ManageWorkingHours = () => {
  const [dealershipWorkingHours, setDealershipWorkingHours] = useState<
    WorkingHour[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDealershipInfoMethod = async () => {
    setIsLoading(true);
    const res = await getDealershipInfo();
    if (res?.success) {
      setDealershipWorkingHours(res?.data?.workingHours as WorkingHour[]);
    } else {
      toast.error(`${res.message}`);
    }
    setIsLoading(false);
  };
  // Initialize time values for all days
  useEffect(() => {
    getDealershipInfoMethod();
  }, []);

  const handleTimeChange = (
    dayOfWeek: string,
    openTime?: string,
    closeTime?: string,
    isClosed?: boolean
  ) => {
    if (isClosed === true || isClosed === false) {
      const newData = dealershipWorkingHours.map((val) =>
        val.dayOfWeek === dayOfWeek ? { ...val, isClosed } : val
      );
      setDealershipWorkingHours(newData);
    }
    if (openTime) {
      const newData = dealershipWorkingHours.map((val) =>
        val.dayOfWeek === dayOfWeek ? { ...val, openTime } : val
      );
      setDealershipWorkingHours(newData);
    }
    if (closeTime) {
      const newData = dealershipWorkingHours.map((val) =>
        val.dayOfWeek === dayOfWeek ? { ...val, closeTime } : val
      );
      setDealershipWorkingHours(newData);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const response = await saveWorkingHours(
      dealershipWorkingHours as WorkingHour[]
    );
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium my-2">Working Hours</h1>
      <p className="text-base text-gray-500 mb-8">
        Set the working hours for your business for each day of the week
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-full my-60">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        dealershipWorkingHours?.map((val) => {
          return (
            <div
              key={val.dayOfWeek}
              className="mt-8 grid grid-cols-12 items-center gap-16"
            >
              <h1 className="text-base font-medium col-span-2">
                {val.dayOfWeek}
              </h1>
              <div className="flex items-center gap-2 col-span-2">
                <Checkbox
                  checked={val.isClosed}
                  onCheckedChange={() =>
                    handleTimeChange(val.dayOfWeek, "", "", !val.isClosed)
                  }
                />
                <h1
                  className={`font-medium text-base ${val.isClosed ? "text-red-500" : "text-green-500"}`}
                >
                  {!val.isClosed ? "Open" : "Close"}
                </h1>
              </div>
              {val.isClosed ? (
                <h1 className="text-base font-medium col-span-8 text-red-500">
                  Closed all day
                </h1>
              ) : (
                <div className="flex flex-1 justify-between gap-8 items-center col-span-8">
                  <Input
                    type="time"
                    className="font-medium text-green-500 text-base"
                    value={val.openTime}
                    onChange={(e) =>
                      handleTimeChange(val.dayOfWeek, e.target.value, "")
                    }
                  />
                  <h1 className="text-base font-medium text-green-500">to</h1>
                  <Input
                    type="time"
                    className="font-medium text-green-500 text-base"
                    value={val.closeTime}
                    onChange={(e) =>
                      handleTimeChange(val.dayOfWeek, "", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          );
        })
      )}
      <div className="flex justify-end mt-8">
        <Button
          className="min-h-12 px-8 text-base"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Working Hours"}
        </Button>
      </div>
    </div>
  );
};

export default ManageWorkingHours;

"use client";
import { testDriveSchema } from "@/lib/zod-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { SelectItem } from "../ui/select";
import { SelectContent } from "../ui/select";
import { SelectValue } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { ExtendedDelaersInfo } from "@/types/types";
import { bookTestDrive } from "@/actions/createTestDrive";
import { toast } from "react-toastify";
import { TestDriveBooking } from "@prisma/client";
import { redirect } from "next/navigation";
interface AvailableSlotsType {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
}

const TestDriveForm = ({
  dealersInfo,
  carId,
  testDriveBookings,
}: {
  dealersInfo: ExtendedDelaersInfo;
  carId: string;
  testDriveBookings: TestDriveBooking[];
}) => {
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    AvailableSlotsType[]
  >([]);

  const form = useForm<z.infer<typeof testDriveSchema>>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      date: new Date(),
      timeSlot: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof testDriveSchema>) => {
    setBookingInProgress(true);
    const [startTime, endTime] = values?.timeSlot?.split("-");
    const response = await bookTestDrive({
      carId: carId,
      bookingDate: format(values.date, "yyyy-MM-dd"),
      startTime,
      endTime,
      notes: values.notes || "",
    });
    if (response?.success) {
      toast.success(response?.message);
      redirect("/reservations");
    } else {
      toast.error(response?.message);
    }
    setBookingInProgress(false);
  };

  const errors = form.formState.errors;

  const selectedDate = form.watch("date");

  const isDayDisabled = (date: Date) => {
    const today = new Date();
    if (date < today) {
      return true;
    }
    const dayOfWeek = format(date, "EEEE").toUpperCase();
    // Find working hours for the day
    const daySchedule = dealersInfo?.workingHours?.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );
    // Disable if dealership is closed on this day
    return !daySchedule || daySchedule.isClosed;
  };

  useEffect(() => {
    if (!selectedDate || !dealersInfo?.workingHours) return;

    const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();

    // Find working hours for the selected day
    const daySchedule = dealersInfo.workingHours.find(
      (day) => day.dayOfWeek === selectedDayOfWeek
    );

    if (!daySchedule || daySchedule.isClosed) {
      setAvailableTimeSlots([]);
      return;
    }

    // Parse opening and closing hours
    const openHour = parseInt(daySchedule.openTime.split(":")[0]);
    const closeHour = parseInt(daySchedule.closeTime.split(":")[0]);

    // Generate time slots (every hour)
    const slots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

      // Check if this slot is already booked
      const isBooked = testDriveBookings.some((booking) => {
        const bookingDate = booking.bookingDate;
        // console.log("bookingDate", format(new Date(bookingDate), "yyyy-MM-dd"));
        // console.log("selectedDate", format(selectedDate, "yyyy-MM-dd"));

        return (
          format(new Date(bookingDate), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd") &&
          (booking.startTime === startTime || booking.endTime === endTime)
        );
      });

      // console.log("isBooked", isBooked);

      if (!isBooked) {
        slots.push({
          id: `${startTime}-${endTime}`,
          label: `${startTime} - ${endTime}`,
          startTime,
          endTime,
        });
      }
    }

    setAvailableTimeSlots(slots);

    // Clear time slot selection when date changes
    form.setValue("timeSlot", "");
  }, [selectedDate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-base font-semibold">
                Date
              </FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "MMM d, yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDayDisabled}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm font-medium text-red-500 mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-base font-semibold">
                Time Slot
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {errors.timeSlot && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.timeSlot.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-base font-semibold">
                Additional Notes (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any specific questions or requests for your test drive?"
                  className="min-h-24"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={bookingInProgress}>
          {bookingInProgress ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking Your Test Drive...
            </>
          ) : (
            "Book Test Drive"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TestDriveForm;

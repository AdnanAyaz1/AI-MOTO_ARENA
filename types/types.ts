import {
  DealershipInfo,
  TestDriveBooking,
  WorkingHour,
} from "@prisma/client/edge";

import { Car } from "@prisma/client/edge";
import { User } from "next-auth";

export interface userInterface {
  name: string;
  image: string;
  id: string;
  email: string;
}

export interface ExtendedCar extends Car {
  savedBy: User[];
}

export interface ExtendedDelaersInfo extends DealershipInfo {
  workingHours: WorkingHour[];
}

export interface ExtendedTestDriveBooking
  extends Omit<
    TestDriveBooking,
    "car" | "user" | "bookingDate" | "createdAt" | "updatedAt"
  > {
  car: Omit<Car, "price" | "mileage" | "createdAt" | "updatedAt"> & {
    price: string;
    mileage: string;
    createdAt: string;
    updatedAt: string;
  };
  user: Omit<User, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export type DashboardDataResponse = {
  cars: {
    total: number;
    available: number;
    sold: number;
    unavailable: number;
    featured: number;
  };
  testDrives: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    conversionRate: number;
  };
};

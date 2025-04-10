import {
  DealershipInfo,
  TestDriveBooking,
  WorkingHour,
} from "@prisma/client/edge";
// import { User, Message, Conversation } from "@prisma/client";
// import { Label } from "@radix-ui/react-label";
// import { string } from "zod";

import { Car } from "@prisma/client/edge";
import { User } from "next-auth";

// // User Type with Optional Relations
// export type ExtendedUser = User & {
//   conversations?: ExtendedConversation[]; // Optional
//   messages?: ExtendedMessage[]; // Optional
//   seenMessages?: ExtendedMessage[]; // Optional
// };

// // Conversation Type with Optional Relations
// export type ExtendedConversation = Conversation & {
//   messages?: ExtendedMessage[]; // Optional
//   users?: ExtendedUser[]; // Optional
// };

// // Message Type with Optional Relations
// export type ExtendedMessage = Message & {
//   sender?: ExtendedUser; // Optional
//   conversation?: ExtendedConversation; // Optional
//   seen?: ExtendedUser[]; // Optional
// };

// export interface MultiSelectInterface {
//   label: string;
//   value: string;
// }
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


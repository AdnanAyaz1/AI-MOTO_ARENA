import { db } from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import {
  handleActionError,
  ServerActionResponse,
  serverActionResponse,
} from "@/lib/action-utils";
import { DashboardDataResponse } from "@/types/types";

export async function getDashboardData(): Promise<
  ServerActionResponse<DashboardDataResponse>
> {
  try {
    const { data: user } = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return serverActionResponse("Unauthorized", false, 401);
    }

    // Fetch all necessary data in a single parallel operation
    const [cars, testDrives] = await Promise.all([
      // Get all cars with minimal fields
      db.car.findMany({
        select: {
          id: true,
          status: true,
          featured: true,
        },
      }),

      // Get all test drives with minimal fields
      db.testDriveBooking.findMany({
        select: {
          id: true,
          status: true,
          carId: true,
        },
      }),
    ]);

    // Calculate car statistics
    const totalCars = cars.length;
    const availableCars = cars.filter(
      (car) => car.status === "AVAILABLE"
    ).length;
    const soldCars = cars.filter((car) => car.status === "SOLD").length;
    const unavailableCars = cars.filter(
      (car) => car.status === "UNAVAILABLE"
    ).length;
    const featuredCars = cars.filter((car) => car.featured === true).length;

    // Calculate test drive statistics
    const totalTestDrives = testDrives.length;
    const pendingTestDrives = testDrives.filter(
      (td) => td.status === "PENDING"
    ).length;
    const confirmedTestDrives = testDrives.filter(
      (td) => td.status === "CONFIRMED"
    ).length;
    const completedTestDrives = testDrives.filter(
      (td) => td.status === "COMPLETED"
    ).length;
    const cancelledTestDrives = testDrives.filter(
      (td) => td.status === "CANCELLED"
    ).length;
    const noShowTestDrives = testDrives.filter(
      (td) => td.status === "NO_SHOW"
    ).length;

    // Calculate test drive conversion rate
    const completedTestDriveCarIds = testDrives
      .filter((td) => td.status === "COMPLETED")
      .map((td) => td.carId);

    const soldCarsAfterTestDrive = cars.filter(
      (car) =>
        car.status === "SOLD" && completedTestDriveCarIds.includes(car.id)
    ).length;

    const conversionRate =
      completedTestDrives > 0
        ? (soldCarsAfterTestDrive / completedTestDrives) * 100
        : 0;

    return serverActionResponse("Data Fetched Successfully", true, 200, {
      cars: {
        total: totalCars,
        available: availableCars,
        sold: soldCars,
        unavailable: unavailableCars,
        featured: featuredCars,
      },
      testDrives: {
        total: totalTestDrives,
        pending: pendingTestDrives,
        confirmed: confirmedTestDrives,
        completed: completedTestDrives,
        cancelled: cancelledTestDrives,
        noShow: noShowTestDrives,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      }
    });
  } catch (error) {
    return handleActionError(error);
  }
}

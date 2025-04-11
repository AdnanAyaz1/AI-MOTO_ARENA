"use server";

import {
  serverActionResponse,
  handleActionError,
  ServerActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";


export async function getCompaniesWithLogos(): Promise<
  ServerActionResponse<{ name: string; image: string }[] | null>
> {
  try {
    const companies = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { company: true },
      distinct: ["company"],
      orderBy: { company: "desc" },
    });

    const companyNames = companies.map((c) => c.company);

    if (companyNames.length === 0) {
      return serverActionResponse("No companies found", true, 200, []);
    }

    const companiesWithLogos = companyNames.map((item) => ({
      name: item,
      image: `https://logo.clearbit.com/${item}.com`,
    }));

    return serverActionResponse(
      "Companies with logos fetched successfully",
      true,
      200,
      companiesWithLogos
    );
  } catch (error) {
    return handleActionError(error);
  }
}

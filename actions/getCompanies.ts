"use server";

import {
  serverActionResponse,
  handleActionError,
  ServerActionResponse,
} from "@/lib/action-utils";
import { db } from "@/lib/prismadb";
import { GoogleGenAI, createUserContent } from "@google/genai";

export async function getCompaniesWithLogos(): Promise<
  ServerActionResponse<{ name: string; image: string }[] | null>
> {
  try {
    const companies = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { company: true },
      distinct: ["company"],
      orderBy: { company: "asc" },
    });

    const companyNames = companies.map((c) => c.company).filter(Boolean);
    if (companyNames.length === 0) {
      return serverActionResponse("No companies found", true, 200, []);
    }

    if (!process.env.GEMINI_API_KEY) {
      return serverActionResponse(
        "Gemini API key is not configured",
        false,
        500,
        null
      );
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are a helpful assistant.

Given a list of car company names, return a JSON array where each object contains:
- "name": The exact car company name
- "domain": The official website domain (e.g., "toyota.com", "bmw.com")

⚠️ Only return the domain name — do not include "https://", subdomains, or paths.
❌ Do not guess domains. Use official sources.
❌ Do not include any explanation or extra text.

Companies:
${companyNames.join(", ")}

Format:
[
  { "name": "Toyota", "domain": "toyota.com" },
  { "name": "BMW", "domain": "bmw.com" }
]
`;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [createUserContent(prompt)],
    });

    const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return serverActionResponse("Invalid AI response", false, 500, null);
    }

    const cleanedText = textResponse.replace(/```json|```/g, "").trim();

    let companyDomainList: { name: string; domain: string }[];
    try {
      companyDomainList = JSON.parse(cleanedText);
    } catch (parseErr) {
      return serverActionResponse(
        "Failed to parse AI JSON response",
        false,
        500,
        null
      );
    }

    const companiesWithLogos = companyDomainList.map((item) => ({
      name: item.name,
      image: `https://logo.clearbit.com/${item.domain}`,
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

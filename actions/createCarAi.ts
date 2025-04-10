"use server";
import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { createUserContent, GoogleGenAI } from "@google/genai";

async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processCarImageWithAI(file: File) {
  // Ensure API key is set
  if (!process.env.GEMINI_API_KEY) {
    return serverActionResponse(
      "Gemini API key is not configured",
      false,
      500,
      null
    );
  }

  try {
    // Initialize Gemini API
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `
      Analyze this car image (the car image is a url of an image.. i am using cloudinary to store the image) and extract the following details generate the description upto 6 sentences:
      - Company (manufacturer)
      - Model
      - Approximate year
      - Color
      - Body type (SUV, Sedan, etc.)
      - Mileage
      - Fuel type (best guess)
      - Transmission type (best guess)
      - Estimated price
      - Short description for a car listing

      **Format the response as JSON only (no extra text), like this:**
      {
        "company": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      Ensure confidence is a number between 0 and 1.
      Respond with JSON only, no extra text.
    `;

    const base64Image = await fileToBase64(file);

    // Create image part for the model
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };
    // Get response from Gemini
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [createUserContent([prompt, imagePart])],
    });

    // Extract response text safely
    const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return serverActionResponse("Invalid response from AI", false, 500, null);
    }

    // Clean JSON response
    const cleanedText = textResponse.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    let carDetails;
    try {
      carDetails = JSON.parse(cleanedText);
    } catch (parseError) {
      return serverActionResponse(
        "Failed to parse AI response as JSON",
        false,
        500,
        null
      );
    }

    // Validate response fields
    const requiredFields = [
      "company",
      "model",
      "year",
      "color",
      "bodyType",
      "price",
      "mileage",
      "fuelType",
      "transmission",
      "description",
      "confidence",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in carDetails)
    );

    if (missingFields.length > 0) {
      return serverActionResponse(
        `AI response missing required fields: ${missingFields.join(", ")}`,
        false,
        400,
        carDetails
      );
    }

    return serverActionResponse(
      "Car details extracted successfully",
      true,
      200,
      carDetails
    );
  } catch (error) {
    return handleActionError(error);
  }
}

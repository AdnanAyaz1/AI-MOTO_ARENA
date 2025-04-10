"use server";

import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { GoogleGenAI, createUserContent } from "@google/genai";

async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export const getCarInfoAi = async (imageData: File) => {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `
      Analyze this single car image the and identify the make and model.
      Return ONLY the car's make and model in this exact JSON format:
      {
        "carName": "Make Model",
        "company": "Make"
      }
      Example: {"carName": "Toyota Corolla", "company": "Toyota"}
      If you cannot identify the car, return null.
    `;

    const base64Image = await fileToBase64(imageData);

    // Create image part for the model
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageData.type,
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
      return serverActionResponse("No response from AI", false, 500, null);
    }

    // Clean and parse JSON response
    const cleanedText = textResponse.replace(/```json|```/g, "").trim();
    const parsedResponse = JSON.parse(cleanedText);

    // Validate response format
    if (!parsedResponse || !parsedResponse.carName || !parsedResponse.company) {
      return serverActionResponse(
        "Could not identify the car",
        false,
        400,
        null
      );
    }

    return serverActionResponse(
      "Car identified successfully",
      true,
      200,
      parsedResponse
    );
  } catch (error) {
    return handleActionError(error);
  }
};

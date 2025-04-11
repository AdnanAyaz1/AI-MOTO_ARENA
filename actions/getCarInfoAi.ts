"use server";

import { handleActionError, serverActionResponse } from "@/lib/action-utils";
import { GoogleGenAI, createUserContent } from "@google/genai";

// I’m converting the image file to Base64 because Gemini API expects inline image data as a string, not as a raw binary file. Base64 encoding takes binary data — like an image — and turns it into a text format that can be safely included in JSON or transmitted over HTTP.

// Since File objects are basically blobs of binary data, I read it into an ArrayBuffer, convert that to a Node Buffer, and then use .toString("base64") to encode it.

async function fileToBase64(file: File) {
  // Step 1: Read the file into an ArrayBuffer (binary representation)
  const bytes = await file.arrayBuffer();
  // → `bytes` now holds binary data like: Uint8Array(1234) [137, 80, 78, 71, ...] (for a PNG image)

  const buffer = Buffer.from(bytes);
  // → `buffer` is a Node.js Buffer object that holds the same binary data.

  return buffer.toString("base64");
  // → Converts that binary data to a base64 string like:
  // "iVBORw0KGgoAAAANSUhEUgAAADIA..." (this is the image content as a string)
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

    // → Sends both the text prompt and image to Gemini
    // → Gemini returns a response in this shape:
    // {
    //   candidates: [
    //     {
    //       content: {
    //         parts: [
    //           { text: '{"carName": "Honda Civic", "company": "Honda"}' }
    //         ]
    //       }
    //     }
    //   ]
    // }
    // Extract response text safely
    const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return serverActionResponse("No response from AI", false, 500, null);
    }
    // → Safely extracts the first response text: '{"carName": "Honda Civic", "company": "Honda"}'
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

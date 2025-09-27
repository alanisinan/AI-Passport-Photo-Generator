import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { PASSPORT_PHOTO_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a file to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string and MIME type.
 */
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Calls the Gemini API to transform an image into a passport photo.
 * @param base64ImageData The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves with the base64 string of the processed image.
 */
export const generatePassportPhoto = async (base64ImageData: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Configuration Error: The Google Gemini API key is missing. Please ensure the API_KEY environment variable is set for this application to function.");
  }
  
  if (!base64ImageData || !mimeType) {
    throw new Error("Image data or MIME type is missing.");
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { text: PASSPORT_PHOTO_PROMPT },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    // Fallback if no image part is found
    const textResponse = response.text?.trim();
    if (textResponse) {
       throw new Error(`AI returned text instead of an image: "${textResponse}"`);
    }

    throw new Error("AI did not return an image. Please try again with a different photo that clearly shows a face.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate photo: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the photo.");
  }
};
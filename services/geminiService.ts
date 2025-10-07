import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Source } from '../types';

// Ensure you have the API_KEY in your environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      description: "The classification of the news. Must be 'Real', 'Fake', or 'Uncertain'.",
    },
    confidence: {
      type: Type.INTEGER,
      description: "A confidence score from 0 to 100 on the classification. If 'Uncertain', this should reflect the level of ambiguity.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation for the classification, in the same language as the input text.",
    },
    sources: {
      type: Type.ARRAY,
      description: "An array of 3-5 relevant web sources to support the classification. Can be empty if no reliable sources are found.",
      items: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING, description: "URL of the source." },
          title: { type: Type.STRING, description: "Title of the source page." },
          snippet: { type: Type.STRING, description: "A brief snippet from the source." },
        },
        required: ["url", "title", "snippet"],
      },
    },
    language: {
        type: Type.STRING,
        description: "The detected language of the input text (e.g., 'English', 'Russian', 'Kazakh').",
    },
  },
  required: ["classification", "confidence", "explanation", "sources", "language"],
};

export const analyzeText = async (text: string, mode: 'Quick' | 'Deep'): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are "TruthLens AI", a sophisticated multilingual fake news detection system. Your task is to analyze the provided text content (from a news article, social media post, etc.) and determine its authenticity. You must work with Kazakh, Russian, and English content.

Your analysis should be thorough and objective. Based on your analysis, you must provide a structured JSON response with the following fields:
- classification: Choose one of "Real", "Fake", or "Uncertain". Use "Uncertain" if there is not enough information, the evidence is contradictory, or the claim is highly subjective.
- confidence: Your confidence in this classification, as an integer percentage from 0 to 100.
- explanation: A clear, concise, and neutral explanation for your decision, written in the same language as the input text. Justify your reasoning. For "Uncertain" results, explain why a definitive classification cannot be made.
- sources: A list of 3-5 credible web sources that either confirm or debunk the information. If no reliable sources can be found, return an empty array.
- language: The name of the detected language of the input text.

The user has selected "${mode} Analysis" mode. Adjust your analysis depth accordingly. A "Deep Analysis" should involve more critical thinking and source cross-referencing.`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: `Please analyze the following text: \n\n"${text}"`,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.2, // Lower temperature for more factual responses
        },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    // Basic validation to ensure the response shape matches our type
    if (
      ['Real', 'Fake', 'Uncertain'].includes(result.classification) &&
      typeof result.confidence === 'number' &&
      typeof result.explanation === 'string' &&
      Array.isArray(result.sources) &&
      typeof result.language === 'string'
    ) {
      return result as AnalysisResult;
    } else {
      throw new Error("The AI response was not in the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid analysis from the AI. The model may be overloaded or the content could not be processed.");
  }
};

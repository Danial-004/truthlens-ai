// api/analyze.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(text);
    const output = result.response.text();

    return res.status(200).json({
      classification: output.includes("fake") ? "FAKE" : "REAL",
      confidence: 0.9,
      explanation: { reasoning: output },
      model: "gemini-1.5-flash",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gemini request failed", details: err.message });
  }
}


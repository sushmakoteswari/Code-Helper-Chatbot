import { VercelRequest, VercelResponse } from '@vercel/node';
import { explanationRequestSchema } from "../shared/schema"; // Adjust import path
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

async function generateExplanation(code: string, topic: string) {
  const response = await fetch("https://api.together.xyz/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      prompt: `Explain the following ${topic}:\n\n${code}`,
      max_tokens: 1000,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].text.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const validated = explanationRequestSchema.parse(req.body);
    const explanation = await generateExplanation(validated.codeOrText, validated.topic);
    res.json({ explanation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed to generate explanation" });
  }
}

import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { explanationRequestSchema } from "@shared/schema";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

async function generateExplanation(code: string, topic: string) {
  const response = await fetch("https://api.together.xyz/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      prompt: `You are an expert at explaining code and technology concepts. Please explain the following ${topic} in clear, concise terms:\n\n${code}\n\nExplanation:`,
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

export async function registerRoutes(app: Express) {
  app.post("/api/explain", async (req, res) => {
    try {
      const validated = explanationRequestSchema.parse(req.body);
      
      const explanation = await generateExplanation(
        validated.codeOrText,
        validated.topic
      );

      const saved = await storage.createExplanation({
        codeOrText: validated.codeOrText,
        topic: validated.topic,
        explanation,
        metadata: {
          language: "auto"
        }
      });

      res.json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to generate explanation" });
      }
    }
  });

  app.get("/api/explanations/recent", async (_req, res) => {
    try {
      const explanations = await storage.getRecentExplanations(5);
      res.json(explanations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent explanations" });
    }
  });

  return createServer(app);
}

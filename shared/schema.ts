import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const explanations = pgTable("explanations", {
  id: serial("id").primaryKey(),
  codeOrText: text("code_or_text").notNull(),
  topic: text("topic").notNull(),
  explanation: text("explanation").notNull(),
  metadata: json("metadata").$type<{
    language?: string;
    tokens?: number;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExplanationSchema = createInsertSchema(explanations).pick({
  codeOrText: true,
  topic: true,
  explanation: true,
  metadata: true,
});

export type InsertExplanation = z.infer<typeof insertExplanationSchema>;
export type Explanation = typeof explanations.$inferSelect;

export const explanationRequestSchema = z.object({
  codeOrText: z.string().min(1, "Code or text is required"),
  topic: z.string().min(1, "Topic is required"),
});

export type ExplanationRequest = z.infer<typeof explanationRequestSchema>;

import { type Explanation, type InsertExplanation } from "@shared/schema";

export interface IStorage {
  getExplanation(id: number): Promise<Explanation | undefined>;
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
  getRecentExplanations(limit?: number): Promise<Explanation[]>;
}

export class MemStorage implements IStorage {
  private explanations: Map<number, Explanation>;
  private currentId: number;

  constructor() {
    this.explanations = new Map();
    this.currentId = 1;
  }

  async getExplanation(id: number): Promise<Explanation | undefined> {
    return this.explanations.get(id);
  }

  async createExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const id = this.currentId++;
    const explanation: Explanation = {
      ...insertExplanation,
      id,
      createdAt: new Date(),
      metadata: insertExplanation.metadata
  ? {
      language: typeof insertExplanation.metadata.language === "string" ? insertExplanation.metadata.language : undefined,
      tokens: typeof insertExplanation.metadata.tokens === "number" ? insertExplanation.metadata.tokens : undefined,
    }
  : null,

    };
    this.explanations.set(id, explanation);
    return explanation;
  }

  async getRecentExplanations(limit = 10): Promise<Explanation[]> {
    return Array.from(this.explanations.values())
      .sort((a, b) => {
        const bTime = b.createdAt?.getTime() || 0;
        const aTime = a.createdAt?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
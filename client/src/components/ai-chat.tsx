import { useState } from "react";
import { Bot } from "lucide-react";
import { CodeInput } from "./code-input";
import { ExplanationOutput } from "./explanation-output";
import { Card } from "@/components/ui/card";
import type { Explanation } from "@shared/schema";

interface AIChatProps {
  onSubmit: (code: string, topic: string) => void;
  isLoading: boolean;
  explanation: Explanation | null;
}

export function AIChat({ onSubmit, isLoading, explanation }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[400px] h-[600px] flex flex-col">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 flex items-center gap-2 border-b">
            <Bot className="w-6 h-6" />
            <h2 className="font-semibold">AI Assistant</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <CodeInput onSubmit={onSubmit} isLoading={isLoading} />
            <ExplanationOutput explanation={explanation} />
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white text-primary text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            AI Assistant
          </span>
        </button>
      )}
    </div>
  );
}

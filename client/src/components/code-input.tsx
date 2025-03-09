import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Import loading spinner icon

interface CodeInputProps {
  onSubmit: (code: string, topic: string) => void;
  isLoading: boolean;
}

export function CodeInput({ onSubmit, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [topic, setTopic] = useState("");

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          📜 Enter Code or Text for Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your code or text here..."
          className="min-h-[180px] font-mono text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          placeholder="Describe what you need explained (e.g., 'Explain this sorting algorithm')"
          className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button
          className="w-full flex items-center justify-center gap-2 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-lg disabled:opacity-50"
          onClick={() => onSubmit(code, topic)}
          disabled={isLoading || !code.trim() || !topic.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Explanation...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface CodeInputProps {
  onSubmit: (code: string, topic: string) => void;
  isLoading: boolean;
}

export function CodeInput({ onSubmit, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [topic, setTopic] = useState("");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code or Text to Explain</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your code or text here..."
          className="min-h-[200px] font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          placeholder="What aspect would you like explained? (e.g. 'How does this algorithm work?')"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button 
          className="w-full"
          onClick={() => onSubmit(code, topic)}
          disabled={isLoading || !code.trim() || !topic.trim()}
        >
          {isLoading ? "Generating Explanation..." : "Explain"}
        </Button>
      </CardContent>
    </Card>
  );
}

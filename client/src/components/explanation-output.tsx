import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Explanation } from "@shared/schema";

interface ExplanationOutputProps {
  explanation: Explanation | null;
}

export function ExplanationOutput({ explanation }: ExplanationOutputProps) {
  const { toast } = useToast();

  if (!explanation) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation.explanation);
    toast({
      title: "Copied!",
      description: "Explanation copied to clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Explanation</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {explanation.explanation.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

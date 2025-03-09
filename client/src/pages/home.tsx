import { AIChat } from "@/components/ai-chat";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Explanation } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();

  const { data: recentExplanations } = useQuery<Explanation[]>({
    queryKey: ["/api/explanations/recent"],
  });

  const explainMutation = useMutation({
    mutationFn: async ({
      code,
      topic,
    }: {
      code: string;
      topic: string;
    }): Promise<Explanation> => {
      const res = await apiRequest("POST", "/api/explain", {
        codeOrText: code,
        topic,
      });
      return res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Code & Tech Explanation Assistant
        </h1>

        {recentExplanations?.length ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Explanations</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {recentExplanations.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm"
                >
                  <h3 className="font-medium mb-2">{exp.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.explanation.slice(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <AIChat
        onSubmit={(code, topic) => explainMutation.mutate({ code, topic })}
        isLoading={explainMutation.isPending}
        explanation={explainMutation.data}
      />
    </div>
  );
}
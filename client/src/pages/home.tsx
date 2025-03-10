import { AIChat } from "@/components/ai-chat";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Explanation } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();

  const { data: recentExplanations } = useQuery<Explanation[]>({
    queryKey: ["/api/explanations/recent"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/explanations/recent");
      return res.json();
    },
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Code & Tech Explanation Assistant
        </h1>

        {recentExplanations?.length ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Recent Explanations</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {recentExplanations.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-xl border bg-card/50 backdrop-blur-lg shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <h3 className="font-semibold text-lg mb-2">{exp.topic}</h3>
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
  explanation={explainMutation.data ?? null} // Ensures undefined is converted to null
/>

    </div>
  );
}

import { CodeInput } from "@/components/code-input";
import { ExplanationOutput } from "@/components/explanation-output";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Explanation } from "@shared/schema";
import { Card } from "@/components/ui/card";

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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Code & Tech Explanation Assistant
      </h1>

      <div className="space-y-8">
        <CodeInput
          onSubmit={(code, topic) => explainMutation.mutate({ code, topic })}
          isLoading={explainMutation.isPending}
        />

        {explainMutation.isPending ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          explainMutation.data && (
            <ExplanationOutput explanation={explainMutation.data} />
          )
        )}

        {recentExplanations?.length ? (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Recent Explanations</h2>
            <div className="space-y-4">
              {recentExplanations.map((exp) => (
                <Card key={exp.id} className="p-4">
                  <h3 className="font-medium mb-2">{exp.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.explanation.slice(0, 200)}...
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
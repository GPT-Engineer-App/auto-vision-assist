import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateDiagnosticResponse } from "@/lib/openai";

import { useProStatus } from "@/contexts/ProStatusContext";

const DiagnosticChat = ({ vehicleId }) => {
  const { isPro } = useProStatus();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: queryCount = 0 } = useQuery({
    queryKey: ["queryCount"],
    queryFn: async () => {
      const queryCountRef = collection(db, "queryCounts");
      const q = query(
        queryCountRef,
        where("timestamp", ">=", new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    },
  });

  const addQueryMutation = useMutation({
    mutationFn: async (newQuery) => {
      await addDoc(collection(db, "diagnosticQueries"), newQuery);
      await addDoc(collection(db, "queryCounts"), { timestamp: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["queryCount"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPro && queryCount >= 5) {
      toast.error("You have reached your query limit. Upgrade to Pro for unlimited queries.");
      return;
    }

    setIsLoading(true);

    try {
      const aiResponse = await generateDiagnosticResponse(input);
      setResponse(aiResponse);

      // Store query and response in Firestore
      addQueryMutation.mutate({
        vehicleId,
        query: input,
        response: aiResponse,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error processing query:", error);
      if (error.message.includes("rate limit")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else {
        toast.error("Error processing your query. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter vehicle symptoms or diagnostic trouble codes..."
          className="w-full"
        />
        <Button type="submit" disabled={!isPro && queryCount >= 5 || isLoading}>
          {isLoading ? "Generating..." : "Get Diagnosis"}
        </Button>
      </form>
      {response && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Diagnosis:</h3>
          <p>{response}</p>
        </div>
      )}
      {!isPro && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Queries remaining: {5 - queryCount}/5
          </p>
          {queryCount >= 5 && (
            <Button onClick={() => toast.info("Please upgrade to Pro for unlimited queries.")}>
              Upgrade to Pro
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticChat;

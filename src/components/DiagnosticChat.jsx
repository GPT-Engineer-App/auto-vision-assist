import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateDiagnosticResponse } from "@/lib/openai";

const DiagnosticChat = ({ vehicleId, isPro }) => {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const fetchQueryCount = async () => {
    const queryCountRef = collection(db, "queryCounts");
    const q = query(
      queryCountRef,
      where("timestamp", ">=", new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const { data: queryCount } = useQuery({
    queryKey: ["queryCount"],
    queryFn: fetchQueryCount,
  });

  const fetchChatHistory = async () => {
    const chatRef = collection(db, "diagnosticQueries");
    const q = query(
      chatRef,
      where("vehicleId", "==", vehicleId),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chatHistory", vehicleId],
    queryFn: fetchChatHistory,
    enabled: !!vehicleId,
  });

  const mutation = useMutation({
    mutationFn: async ({ input }) => {
      const aiResponse = await generateDiagnosticResponse(input);
      await addDoc(collection(db, "diagnosticQueries"), {
        vehicleId,
        query: input,
        response: aiResponse,
        timestamp: new Date(),
      });
      await addDoc(collection(db, "queryCounts"), {
        timestamp: new Date(),
      });
      return aiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chatHistory", vehicleId]);
      queryClient.invalidateQueries(["queryCount"]);
      setInput("");
    },
    onError: (error) => {
      toast.error("Error processing your query: " + error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPro && queryCount >= 5) {
      toast.error("You have reached your query limit. Upgrade to Pro for unlimited queries.");
      return;
    }
    mutation.mutate({ input });
  };

  if (isLoadingHistory) {
    return <div>Loading chat history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto border rounded p-4">
        {chatHistory && chatHistory.map((message) => (
          <div key={message.id} className="mb-4">
            <p className="font-bold">You: {message.query}</p>
            <p>AI: {message.response}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter vehicle symptoms or diagnostic trouble codes..."
          className="w-full"
        />
        <Button type="submit" disabled={!isPro && queryCount >= 5 || mutation.isLoading}>
          {mutation.isLoading ? "Generating..." : "Get Diagnosis"}
        </Button>
      </form>
      {!isPro && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Queries remaining: {5 - (queryCount || 0)}/5
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
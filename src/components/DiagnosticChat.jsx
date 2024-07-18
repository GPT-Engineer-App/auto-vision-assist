import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const DiagnosticChat = ({ vehicleId, isPro }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [queryCount, setQueryCount] = useState(0);

  const fetchQueryCount = async () => {
    if (!auth.currentUser) return 0;
    const queryCountRef = collection(db, "queryCounts");
    const q = query(
      queryCountRef,
      where("userId", "==", auth.currentUser.uid),
      where("timestamp", ">=", new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const { data: currentQueryCount } = useQuery({
    queryKey: ["queryCount", auth.currentUser?.uid],
    queryFn: fetchQueryCount,
    enabled: !!auth.currentUser,
  });

  useEffect(() => {
    if (currentQueryCount !== undefined) {
      setQueryCount(currentQueryCount);
    }
  }, [currentQueryCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to use the diagnostic chat");
      return;
    }

    if (!isPro && queryCount >= 30) {
      toast.error("You have reached your query limit. Upgrade to Pro for unlimited queries.");
      return;
    }

    try {
      // TODO: Replace with actual AI model API call
      const aiResponse = await mockAIResponse(input);
      setResponse(aiResponse);

      // Store query and response in Firestore
      await addDoc(collection(db, "diagnosticQueries"), {
        userId: auth.currentUser.uid,
        vehicleId,
        query: input,
        response: aiResponse,
        timestamp: new Date(),
      });

      // Update query count
      await addDoc(collection(db, "queryCounts"), {
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      });

      setQueryCount((prev) => prev + 1);
    } catch (error) {
      toast.error("Error processing your query: " + error.message);
    }
  };

  // Mock AI response function (replace with actual API call)
  const mockAIResponse = async (input) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    return `Here's a possible diagnosis for "${input}": [Mock AI response]`;
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
        <Button type="submit" disabled={!isPro && queryCount >= 30}>
          Get Diagnosis
        </Button>
      </form>
      {response && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Diagnosis:</h3>
          <p>{response}</p>
        </div>
      )}
      {!isPro && (
        <p className="text-sm text-muted-foreground">
          Queries remaining: {30 - queryCount}/30
        </p>
      )}
    </div>
  );
};

export default DiagnosticChat;
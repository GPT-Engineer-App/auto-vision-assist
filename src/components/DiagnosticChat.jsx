import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateDiagnosticResponse } from "@/lib/openai";

const DiagnosticChat = ({ vehicleId, isPro }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQueryCount = async () => {
    const queryCountRef = collection(db, "queryCounts");
    const q = query(
      queryCountRef,
      where("timestamp", ">=", new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const { data: currentQueryCount } = useQuery({
    queryKey: ["queryCount"],
    queryFn: fetchQueryCount,
  });

  useEffect(() => {
    if (currentQueryCount !== undefined) {
      setQueryCount(currentQueryCount);
    }
  }, [currentQueryCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPro && queryCount >= 30) {
      toast.error("You have reached your query limit. Upgrade to Pro for unlimited queries.");
      return;
    }

    setIsLoading(true);

    try {
      const aiResponse = await generateDiagnosticResponse(input);
      setResponse(aiResponse);

      // Store query and response in Firestore
      await addDoc(collection(db, "diagnosticQueries"), {
        vehicleId,
        query: input,
        response: aiResponse,
        timestamp: new Date(),
      });

      // Update query count
      await addDoc(collection(db, "queryCounts"), {
        timestamp: new Date(),
      });

      setQueryCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error processing query:", error);
      toast.error("Error processing your query: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseQueries = () => {
    // Implement the logic for purchasing additional queries
    toast.success("Additional queries purchased successfully!");
    setQueryCount(0); // Reset the query count or add the purchased amount
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
        <Button type="submit" disabled={!isPro && queryCount >= 30 || isLoading}>
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
            Queries remaining: {30 - queryCount}/30
          </p>
          {queryCount >= 30 && (
            <Button onClick={handlePurchaseQueries}>
              Purchase More Queries
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticChat;
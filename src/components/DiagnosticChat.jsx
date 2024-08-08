import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { generateDiagnosticResponse } from "@/lib/openai";
import { useProStatus } from "@/contexts/ProStatusContext";

const DiagnosticChat = ({ vehicleId }) => {
  const { isPro } = useProStatus();
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: queryCount = 0, refetch: refetchQueryCount } = useQuery({
    queryKey: ["queryCount", auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) return 0;
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      return userDoc.data()?.queryCount || 0;
    },
    enabled: !!auth.currentUser,
  });

  const addQueryMutation = useMutation({
    mutationFn: async (newQuery) => {
      await addDoc(collection(db, "diagnosticQueries"), newQuery);
      if (!isPro) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { queryCount: increment(-1) });
      }
    },
    onSuccess: () => {
      refetchQueryCount();
    },
  });

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (auth.currentUser && vehicleId) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "diagnosticQueries"),
            where("userId", "==", auth.currentUser.uid),
            where("vehicleId", "==", vehicleId),
            limit(50)
          )
        );
        const history = querySnapshot.docs.map(doc => doc.data());
        setChatHistory(history.sort((a, b) => a.timestamp - b.timestamp));
      }
    };
    fetchChatHistory();
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPro && queryCount <= 0) {
      toast.error("You have reached your query limit. Upgrade to Pro for unlimited queries.");
      return;
    }

    setIsLoading(true);

    try {
      const aiResponse = await generateDiagnosticResponse(input);
      const newQuery = {
        userId: auth.currentUser.uid,
        vehicleId,
        query: input,
        response: aiResponse,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, newQuery]);
      addQueryMutation.mutate(newQuery);
      setInput("");
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
      <ScrollArea className="h-[400px] border rounded-md p-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-4">
            <div className="bg-primary/10 p-2 rounded-md mb-2">
              <p className="font-semibold">You:</p>
              <p>{chat.query}</p>
            </div>
            <div className="bg-secondary/10 p-2 rounded-md">
              <p className="font-semibold">AI:</p>
              <p>{chat.response}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter vehicle symptoms or diagnostic trouble codes..."
          className="w-full"
        />
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={!isPro && queryCount <= 0 || isLoading}>
            {isLoading ? "Generating..." : "Send"}
          </Button>
          {!isPro && (
            <p className="text-sm text-muted-foreground">
              Queries remaining: {queryCount}
            </p>
          )}
        </div>
      </form>
      {!isPro && queryCount <= 0 && (
        <Button onClick={() => toast.info("Please upgrade to Pro for unlimited queries.")}>
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
};

export default DiagnosticChat;

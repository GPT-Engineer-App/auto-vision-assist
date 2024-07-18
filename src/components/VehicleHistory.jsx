import { useQuery } from "@tanstack/react-query";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const VehicleHistory = ({ vehicleId }) => {
  const fetchVehicleHistory = async () => {
    if (!auth.currentUser) return [];
    const historyRef = collection(db, "diagnosticQueries");
    const q = query(
      historyRef,
      where("userId", "==", auth.currentUser.uid),
      where("vehicleId", "==", vehicleId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const { data: history, isLoading, error } = useQuery({
    queryKey: ["vehicleHistory", vehicleId],
    queryFn: fetchVehicleHistory,
    enabled: !!auth.currentUser && !!vehicleId,
  });

  if (isLoading) return <div>Loading history...</div>;
  if (error) return <div>Error loading history: {error.message}</div>;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {history && history.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Query: {item.query}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.response}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(item.timestamp.toDate()).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default VehicleHistory;
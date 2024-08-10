import React, { useState, useEffect } from 'react';
import { useProStatus } from '../contexts/ProStatusContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RangeFinder = () => {
  const { isPro } = useProStatus();
  const { user } = useAuth();
  const { dtc } = useParams();
  const [remainingQueries, setRemainingQueries] = useState(0);
  const [rangeFinderResult, setRangeFinderResult] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setRemainingQueries(userData.queryCount);
      }
    };
    fetchUserData();
  }, [user]);

  const handleRangeFinder = async () => {
    if (!isPro && remainingQueries <= 0) {
      toast.error("You've used all your free queries. Upgrade to Pro for unlimited access!");
      return;
    }

    try {
      // Simulating Range Finder analysis
      setRangeFinderResult(`Range Finder analysis for DTC ${dtc}: This is a placeholder result.`);

      if (!isPro) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          queryCount: increment(-1)
        });
        setRemainingQueries(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error in Range Finder:", error);
      toast.error("Failed to perform Range Finder analysis. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Range Finder: DTC</h1>
      <Input 
        type="text" 
        value={dtc} 
        placeholder="Enter DTC code" 
        className="mb-4"
        readOnly
      />
      <Button onClick={handleRangeFinder}>Analyze</Button>
      {!isPro && (
        <p className="mt-2">Remaining queries: {remainingQueries}</p>
      )}
      {rangeFinderResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Range Finder Result:</h3>
          <p>{rangeFinderResult}</p>
        </div>
      )}
    </div>
  );
};

export default RangeFinder;

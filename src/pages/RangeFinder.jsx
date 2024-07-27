import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { checkPurchaseStatus, useRangefinderQuery } from "@/lib/inAppPurchase";
import { toast } from "sonner";

const RangeFinder = () => {
  const { dtc } = useParams();
  const [analysis, setAnalysis] = useState(null);

  const { data: purchaseStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['purchaseStatus'],
    queryFn: checkPurchaseStatus,
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      const canUseQuery = await useRangefinderQuery();
      if (canUseQuery) {
        // Here you would typically make an API call to get the analysis
        // For now, we'll use mock data
        setAnalysis({
          components: [
            { name: "Throttle Body", probability: 75 },
            { name: "Mass Airflow Sensor", probability: 60 },
            { name: "Oxygen Sensor", probability: 45 },
          ],
          description: "Based on the DTC and vehicle information, the most likely cause is a faulty throttle body. However, issues with the mass airflow sensor or oxygen sensor could also be contributing factors.",
        });
      } else {
        toast.error("No Range Finder queries available. Please purchase more.");
      }
    };

    if (dtc) {
      fetchAnalysis();
    }
  }, [dtc]);

  if (isLoadingStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Range Finder Analysis for DTC: {dtc}</h1>
      {analysis ? (
        <div>
          <p className="mb-4">{analysis.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.components.map((component, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{component.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Probability: {component.probability}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p>No analysis available. Please enter a valid DTC.</p>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Your Range Finder Status</h2>
        <p>Queries Remaining: {purchaseStatus?.rangefinderQueries || 0}</p>
        <Button className="mt-2" onClick={() => toast.info("Redirecting to purchase page...")}>
          Purchase More Queries
        </Button>
      </div>
    </div>
  );
};

export default RangeFinder;
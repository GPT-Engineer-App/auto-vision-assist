import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const RangeFinder = ({ isPro }) => {
  const { dtc } = useParams();
  const [remainingQueries, setRemainingQueries] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch the remaining queries from the backend
    setRemainingQueries(10);
  }, []);

  const handlePurchaseQueryPack = () => {
    // In a real application, this would initiate the purchase process
    toast.success("Query pack purchased successfully! 20 queries added.");
    setRemainingQueries(prev => prev + 20);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Range Finder: {dtc}</h1>
      
      <Tabs defaultValue="analysis" className="mb-6">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>DTC Analysis</CardTitle>
              <CardDescription>Detailed analysis for {dtc}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your DTC analysis content here */}
              <p>Analysis content for {dtc}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Free Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  <li>Basic DTC lookup</li>
                  <li>Limited Range Finder queries</li>
                  <li>Access to community forums</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  <li>Advanced DTC analysis</li>
                  <li>Unlimited Range Finder queries</li>
                  <li>Priority support</li>
                  <li>Access to historical data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Query Pack Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>For every $20 query pack purchase, you receive 20 'Range Finder' queries.</p>
          <p className="mt-2">Remaining queries: {remainingQueries}</p>
          <Button onClick={handlePurchaseQueryPack} className="mt-4">Purchase Query Pack</Button>
        </CardContent>
      </Card>

      {!isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Upgrade to Pro for unlimited Range Finder queries and more advanced features!</p>
            <Button className="mt-4">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RangeFinder;
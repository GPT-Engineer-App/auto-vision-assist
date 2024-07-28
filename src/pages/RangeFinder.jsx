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
      <h1 className="text-3xl font-bold mb-6 text-primary">Range Finder: {dtc}</h1>
      
      <Tabs defaultValue="analysis" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analysis</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Features</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>DTC Analysis</CardTitle>
              <CardDescription>Detailed Analysis content for DTC's</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your DTC analysis content here */}
              <p>Detailed Analysis content for DTC's</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card text-card-foreground">
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
            <Card className="bg-card text-card-foreground">
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

      <Card className="mb-6 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Query Pack Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>For every $20 query pack purchase, you receive 20 'Range Finder: DTC' queries.</p>
          <p className="mt-2">Remaining queries: {remainingQueries}</p>
          <Button onClick={handlePurchaseQueryPack} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Purchase Query Pack</Button>
        </CardContent>
      </Card>

      {!isPro && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Upgrade to Pro for unlimited Range Finder: DTC queries and more advanced features!</p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RangeFinder;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchDTCByCode } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';

const RangeFinder = ({ isPro }) => {
  const { dtc } = useParams();
  const [remainingQueries, setRemainingQueries] = useState(0);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    engine: '',
  });

  const { data: dtcData, isLoading, error } = useQuery({
    queryKey: ['dtc', dtc],
    queryFn: () => fetchDTCByCode(dtc),
    enabled: !!dtc,
  });

  useEffect(() => {
    // In a real application, you would fetch the remaining queries from the backend
    setRemainingQueries(isPro ? Infinity : 10);
  }, [isPro]);

  const handlePurchaseQueryPack = () => {
    // In a real application, this would initiate the purchase process
    toast.success("Query pack purchased successfully! 20 queries added.");
    setRemainingQueries(prev => prev + 20);
  };

  const handleVehicleInfoChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = () => {
    if (remainingQueries > 0 || isPro) {
      // Perform analysis here
      toast.success("Analysis complete!");
      if (!isPro) {
        setRemainingQueries(prev => prev - 1);
      }
    } else {
      toast.error("No remaining queries. Please purchase a query pack or upgrade to Pro.");
    }
  };

  if (isLoading) return <div>Loading DTC information...</div>;
  if (error) return <div>Error loading DTC information: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Range Finder: DTC {dtc}</h1>
      
      <Tabs defaultValue="analysis" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analysis</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Features</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis">
          <Card className="bg-card text-card-foreground mb-6">
            <CardHeader>
              <CardTitle>DTC Information</CardTitle>
              <CardDescription>Details about the selected DTC</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Code:</strong> {dtcData?.code}</p>
              <p><strong>Description:</strong> {dtcData?.description}</p>
              <p><strong>Possible Causes:</strong> {dtcData?.possible_causes}</p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>Enter your vehicle details for a more accurate analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" name="make" value={vehicleInfo.make} onChange={handleVehicleInfoChange} />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={vehicleInfo.model} onChange={handleVehicleInfoChange} />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" value={vehicleInfo.year} onChange={handleVehicleInfoChange} />
                </div>
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <Input id="engine" name="engine" value={vehicleInfo.engine} onChange={handleVehicleInfoChange} />
                </div>
              </div>
              <Button onClick={handleAnalyze} className="mt-4 w-full">Analyze</Button>
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

      {!isPro && (
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
      )}

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

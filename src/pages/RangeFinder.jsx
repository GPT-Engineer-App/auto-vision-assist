import React, { useState, useEffect } from 'react';
import { useProStatus } from '@/contexts/ProStatusContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDTCByCode } from '@/lib/firebase';
import { generateDiagnosticResponse } from '@/lib/openai';
import { purchaseQueryPack, consumeQuery, checkQueryPackPurchaseStatus } from '@/lib/inAppPurchase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const RangeFinder = () => {
  const { isPro } = useProStatus();
  const { dtc: initialDtc } = useParams();
  const navigate = useNavigate();
  const [dtcInput, setDtcInput] = useState(initialDtc || '');
  const [remainingQueries, setRemainingQueries] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const fetchQueryCount = async () => {
      const count = await checkQueryPackPurchaseStatus();
      setRemainingQueries(count);
    };
    fetchQueryCount();
  }, []);

  const { data: dtcInfo, refetch: refetchDtc } = useQuery({
    queryKey: ['dtc', dtcInput],
    queryFn: () => fetchDTCByCode(dtcInput),
    enabled: false,
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!isPro && remainingQueries <= 0) {
        throw new Error("No queries remaining. Please purchase a query pack.");
      }
      const dtcData = await refetchDtc();
      if (!dtcData.data) {
        throw new Error("DTC not found");
      }
      const response = await generateDiagnosticResponse(`Analyze DTC ${dtcInput}: ${dtcData.data.description}`);
      if (!isPro) {
        await consumeQuery();
        setRemainingQueries(prev => prev - 1);
      }
      return response;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAnalyze = () => {
    if (!dtcInput) {
      toast.error("Please enter a DTC code");
      return;
    }
    analyzeMutation.mutate();
  };

  const handlePurchaseQueryPack = async () => {
    try {
      const result = await purchaseQueryPack();
      if (result.success) {
        toast.success("Query pack purchased successfully");
        const newCount = await checkQueryPackPurchaseStatus();
        setRemainingQueries(newCount);
      } else {
        toast.error(result.error || "Failed to purchase query pack");
      }
    } catch (error) {
      console.error("Error purchasing query pack:", error);
      toast.error("An error occurred while purchasing the query pack");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Range Finder: DTC</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Enter DTC code..."
          value={dtcInput}
          onChange={(e) => setDtcInput(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleAnalyze} disabled={analyzeMutation.isLoading}>
          {analyzeMutation.isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      {!isPro && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Queries Remaining: {remainingQueries}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePurchaseQueryPack}>Purchase Query Pack</Button>
          </CardContent>
        </Card>
      )}
      {dtcInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>DTC Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Code:</strong> {dtcInfo.code}</p>
            <p><strong>Description:</strong> {dtcInfo.description}</p>
          </CardContent>
        </Card>
      )}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{analysisResult}</p>
          </CardContent>
        </Card>
      )}
      <Button onClick={() => navigate('/dtc-codes')} className="mt-4">
        Back to DTC Codes
      </Button>
    </motion.div>
  );
};

export default RangeFinder;

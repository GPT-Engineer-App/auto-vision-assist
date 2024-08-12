import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchDTCByCode } from '@/lib/firebase';
import { toast } from "sonner";
import { generateDiagnosticResponse } from '@/lib/openai';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const DTCModal = ({ isOpen, onClose }) => {
  const [dtcCode, setDtcCode] = useState('');
  const [dtcInfo, setDtcInfo] = useState(null);
  const [diagnosticResponse, setDiagnosticResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!dtcCode) {
      toast.error("Please enter a DTC code");
      return;
    }
    setLoading(true);
    try {
      const info = await fetchDTCByCode(dtcCode);
      if (info) {
        setDtcInfo(info);
        const response = await generateDiagnosticResponse(`Provide a diagnostic response for DTC ${dtcCode}: ${info.description}`);
        setDiagnosticResponse(response);
      } else {
        toast.error("DTC code not found");
      }
    } catch (error) {
      console.error("Error fetching DTC info:", error);
      if (error.message.includes("rate limit")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else {
        toast.error("Error fetching DTC information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDtcCode('');
    setDtcInfo(null);
    setDiagnosticResponse('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>DTC Code Reference</DialogTitle>
        </DialogHeader>
        <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <FormField
            name="dtcCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DTC Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter DTC"
                    {...field}
                    value={dtcCode}
                    onChange={(e) => setDtcCode(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </Form>
        {dtcInfo && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>DTC: {dtcInfo.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Description:</strong> {dtcInfo.description}</p>
              {diagnosticResponse && (
                <div className="mt-4">
                  <h4 className="font-semibold">Diagnostic Response:</h4>
                  <p>{diagnosticResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DTCModal;

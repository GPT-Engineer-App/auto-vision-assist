import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchDTCByCode } from '@/lib/firebase';
import { toast } from "sonner";
import { generateDiagnosticResponse } from '@/lib/openai';

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
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter DTC"
              value={dtcCode}
              onChange={(e) => setDtcCode(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          {dtcInfo && (
            <div className="grid gap-2">
              <h3 className="font-semibold">DTC: {dtcInfo.code}</h3>
              <p><strong>Description:</strong> {dtcInfo.description}</p>
              {diagnosticResponse && (
                <div>
                  <h4 className="font-semibold mt-2">Diagnostic Response:</h4>
                  <p>{diagnosticResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DTCModal;

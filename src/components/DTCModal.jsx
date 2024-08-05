import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchDTCByCode } from '@/lib/firebase';
import { toast } from "sonner";

const DTCModal = ({ isOpen, onClose }) => {
  const [dtcCode, setDtcCode] = useState('');
  const [dtcInfo, setDtcInfo] = useState(null);
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
      } else {
        toast.error("DTC code not found");
      }
    } catch (error) {
      console.error("Error fetching DTC info:", error);
      toast.error("Error fetching DTC information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DTC Code Reference</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
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
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-bold mb-2">{dtcInfo.code}</h3>
              <p><strong>Description:</strong> {dtcInfo.description}</p>
              <p><strong>Possible Causes:</strong> {dtcInfo.possible_causes}</p>
              <p><strong>Theory of Operation:</strong> {dtcInfo.diagnostic_aids}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DTCModal;
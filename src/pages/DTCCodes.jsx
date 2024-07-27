import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dtcCodes } from '@/lib/dtc-codes';
import DTCAnalysisView from '@/components/DTCAnalysisView';

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDTC, setSelectedDTC] = useState(null);

  const filteredCodes = useMemo(() => {
    return dtcCodes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // This function would be replaced with actual API calls or more complex logic
  const generateAnalysisData = (dtc) => {
    // Mock data generation based on the selected DTC
    return {
      components: [
        { name: "Throttle Body", count: 5 },
        { name: "Throttle Body Gasket", count: 4 },
        { name: "Throttle Position Sensor", count: 3 },
        { name: "Brake Light Switch", count: 2 },
        { name: "Powertrain Control Module", count: 1 },
      ],
      dtcs: [
        { code: dtc, count: 10 },
        { code: "P0122", count: 8 },
        { code: "P0123", count: 6 },
        { code: "P0124", count: 4 },
        { code: "P0125", count: 2 },
      ],
      symptoms: [
        { description: "Check Engine Light On", count: 15 },
        { description: "Poor Acceleration", count: 12 },
        { description: "Stalling", count: 9 },
        { description: "Reduced Power", count: 7 },
        { description: "Rough Idle", count: 5 },
      ],
    };
  };

  const handleDTCSelect = (dtc) => {
    setSelectedDTC(dtc);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">DTC Code Reference</h1>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search DTC code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">DTC Codes</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.code}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDTCSelect(code.code)}>Analyze</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedDTC && (
              <DTCAnalysisView {...generateAnalysisData(selectedDTC)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTCCodes;
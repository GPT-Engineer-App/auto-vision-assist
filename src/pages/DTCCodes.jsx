import { useState, useEffect } from 'react';
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
import { fetchAndStoreDTCs, searchDTCCodes } from '@/lib/dtcUtils';
import DTCAnalysisView from '@/components/DTCAnalysisView';

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedDTC, setSelectedDTC] = useState(null);

  useEffect(() => {
    fetchAndStoreDTCs();
  }, []);

  const handleSearch = async () => {
    const result = await searchDTCCodes(searchTerm);
    setSearchResult(result);
    setSelectedDTC(result ? result.code : null);
  };

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
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Result</h2>
            {searchResult ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{searchResult.code}</TableCell>
                    <TableCell>{searchResult.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No DTC code found. Please try another search.</p>
            )}
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
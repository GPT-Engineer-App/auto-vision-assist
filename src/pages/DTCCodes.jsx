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
  const [showAnalysis, setShowAnalysis] = useState(false);

  const filteredCodes = useMemo(() => {
    return dtcCodes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Mock data for the analysis view
  const mockAnalysisData = {
    components: [
      { name: "Disc Brake Pad", count: 37764 },
      { name: "Brake Rotor", count: 30194 },
      { name: "Battery", count: 27079 },
      { name: "Engine Water Pump", count: 19514 },
      { name: "Fuel Filter", count: 16361 },
      { name: "Wheel Hub Assembly", count: 15947 },
      { name: "Air Conditioning Refri...", count: 12771 },
      { name: "Spark Plug", count: 11367 },
      { name: "Engine Coolant Ther...", count: 11216 },
      { name: "Fuel Pump", count: 9367 },
    ],
    dtcs: [
      { code: "P0171: System Too L...", count: 1848 },
      { code: "P0174: System Too L...", count: 1444 },
      { code: "P0300: Random/Multi...", count: 1124 },
      { code: "P0446: Evaporative E...", count: 1102 },
      { code: "P0455: Evaporative E...", count: 1086 },
      { code: "C0327", count: 863 },
      { code: "P0442: Evaporative E...", count: 848 },
      { code: "P0101: Mass Or Volu...", count: 708 },
      { code: "P0135: O2 Sensor He...", count: 704 },
      { code: "P0449: Evaporative E...", count: 693 },
    ],
    symptoms: [
      { description: "Engine Does Not Start", count: 6310 },
      { description: "Coolant Leaks From V...", count: 5307 },
      { description: "Air Conditioning Inop...", count: 3420 },
      { description: "Noise Heard From Bra...", count: 3345 },
      { description: "Fluid Leaks From Vehi...", count: 2917 },
      { description: "Noise Heard", count: 2144 },
      { description: "Noise Heard From Fro...", count: 1935 },
      { description: "Engine Runs Rough", count: 1680 },
      { description: "Engine Overheats", count: 1387 },
      { description: "4wd Light On", count: 1278 },
    ],
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-4" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("/images/dtc-codes-background.png")'}}>
      <div className="container mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">DTC Code Reference</h1>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search DTC code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={() => setShowAnalysis(!showAnalysis)}>
            {showAnalysis ? "Hide Analysis" : "Show Analysis"}
          </Button>
        </div>
        {showAnalysis ? (
          <DTCAnalysisView
            components={mockAnalysisData.components}
            dtcs={mockAnalysisData.dtcs}
            symptoms={mockAnalysisData.symptoms}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.code}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DTCCodes;
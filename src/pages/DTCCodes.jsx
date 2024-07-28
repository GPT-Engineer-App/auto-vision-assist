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
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { generateDiagnosticResponse } from "@/lib/openai";

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDTC, setSelectedDTC] = useState(null);
  const [dtcInput, setDtcInput] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const filteredCodes = useMemo(() => {
    return dtcCodes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAnalyze = async () => {
    if (!dtcInput) {
      toast.error("Please enter a DTC code to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const prompt = `Analyze DTC code ${dtcInput}. Provide common components for failure and common associated DTCs.`;
      const response = await generateDiagnosticResponse(prompt);
      
      // Parse the response and update the state
      const analysisResult = parseAnalysisResponse(response);
      setAnalysisData(analysisResult);
      setSelectedDTC(dtcInput);
    } catch (error) {
      console.error("Error analyzing DTC:", error);
      toast.error("Failed to analyze DTC. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAnalysisResponse = (response) => {
    // This is a simple parser. You might need to adjust it based on the actual response format
    const components = response.match(/Common components for failure:([\s\S]*?)(?=Common associated DTCs:|$)/i)?.[1].split(',').map(item => ({ name: item.trim(), count: Math.floor(Math.random() * 10) + 1 })) || [];
    const dtcs = response.match(/Common associated DTCs:([\s\S]*?)$/i)?.[1].split(',').map(item => ({ code: item.trim(), count: Math.floor(Math.random() * 10) + 1 })) || [];
    
    return {
      components,
      dtcs,
      symptoms: [{ description: "Check Engine Light On", count: 15 }], // Add more dynamic symptoms if available in the response
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
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Analyze DTC</h2>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter DTC code..."
              value={dtcInput}
              onChange={(e) => setDtcInput(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
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
                      <Button onClick={() => {
                        setDtcInput(code.code);
                        handleAnalyze();
                      }}>Analyze</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedDTC && analysisData && (
              <DTCAnalysisView {...analysisData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTCCodes;
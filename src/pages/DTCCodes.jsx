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
import DTCAnalysisView from '@/components/DTCAnalysisView';
import { useNavigate } from 'react-router-dom';
import { getDTCCodes, searchDTCCodes } from '@/lib/dtcUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDTC, setSelectedDTC] = useState(null);
  const [dtcInput, setDtcInput] = useState('');
  const [dtcCodes, setDtcCodes] = useState([]);
  const [dtcDescription, setDtcDescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDTCCodes = async () => {
      const codes = await getDTCCodes();
      setDtcCodes(codes);
    };
    fetchDTCCodes();
  }, []);

  useEffect(() => {
    const searchDTCs = async () => {
      if (searchTerm) {
        const results = await searchDTCCodes(searchTerm);
        setDtcCodes(results);
      } else {
        const allCodes = await getDTCCodes();
        setDtcCodes(allCodes);
      }
    };
    searchDTCs();
  }, [searchTerm]);

  const handleAnalyze = async () => {
    if (dtcInput) {
      console.log('Analyzing DTC:', dtcInput);
      const results = await searchDTCCodes(dtcInput);
      console.log('Analysis results:', results);
      if (results.length > 0) {
        setDtcDescription(results[0]);
      } else {
        setDtcDescription(null);
      }
    }
  };

  const handleDTCSelect = (dtc) => {
    setSelectedDTC(dtc);
    setDtcDescription(dtc);
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
            <Button onClick={handleAnalyze}>Analyze</Button>
          </div>
          {dtcDescription && (
            <Card className="mt-4 p-4 bg-gray-100 rounded-md">
              <CardHeader>
                <CardTitle>{dtcDescription.code}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">Description:</h3>
                <p>{dtcDescription.description}</p>
                <h3 className="font-semibold mt-2">Possible Causes:</h3>
                <ul className="list-disc pl-5">
                  {dtcDescription.possibleCauses.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mt-2">Diagnostic Aids:</h3>
                <p>{dtcDescription.diagnosticAids}</p>
                <h3 className="font-semibold mt-2">Application:</h3>
                <ul>
                  {Object.entries(dtcDescription.application).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
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
                {dtcCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDTCSelect(code)}>Analyze</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedDTC && (
              <DTCAnalysisView dtc={selectedDTC} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTCCodes;
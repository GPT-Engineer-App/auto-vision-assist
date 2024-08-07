import React, { useState } from 'react';
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
import { searchDTCs, fetchAllDTCs } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDTC, setSelectedDTC] = useState(null);
  const [dtcInput, setDtcInput] = useState('');
  const navigate = useNavigate();

  const { data: allDTCs, isLoading: isLoadingAllDTCs } = useQuery({
    queryKey: ['allDTCs'],
    queryFn: fetchAllDTCs
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchDTCs', searchTerm],
    queryFn: () => searchDTCs(searchTerm),
    enabled: searchTerm.length > 0
  });

  const filteredCodes = searchTerm ? searchResults : allDTCs;

  const handleAnalyze = () => {
    if (dtcInput) {
      navigate(`/range-finder/${dtcInput}`);
    }
  };

  const handleDTCSelect = (dtc) => {
    setSelectedDTC(dtc);
  };

  if (isLoadingAllDTCs) {
    return <div>Loading DTC codes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
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
          <Button onClick={handleAnalyze}>Range Finder: DTC</Button>
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
              {isSearching ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Searching...</TableCell>
                </TableRow>
              ) : filteredCodes && filteredCodes.map((code) => (
                <TableRow key={code.code}>
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
  );
};

export default DTCCodes;

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
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
import { searchDTCs, fetchAllDTCs, fetchDTCByCode } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDTC, setSelectedDTC] = useState(null);
  const [dtcInput, setDtcInput] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: allDTCs, isLoading: isLoadingAllDTCs, error: dtcError } = useQuery({
    queryKey: ['allDTCs'],
    queryFn: fetchAllDTCs,
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Error fetching DTCs:", error);
      toast.error("Failed to load DTC codes. Please try again later.");
    },
    enabled: !!user
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchDTCs', searchTerm],
    queryFn: () => searchDTCs(searchTerm),
    enabled: searchTerm.length > 0
  });

  const { refetch: refetchDTC, isLoading: isAnalyzing } = useQuery({
    queryKey: ['dtc', dtcInput],
    queryFn: () => fetchDTCByCode(dtcInput),
    enabled: false,
  });

  const filteredCodes = searchTerm ? searchResults : allDTCs;

  const handleAnalyze = async () => {
    if (dtcInput) {
      try {
        const result = await refetchDTC();
        if (result.data) {
          setSelectedDTC(result.data);
        } else {
          toast.error("DTC code not found");
        }
      } catch (error) {
        console.error("Error fetching DTC:", error);
        toast.error("Failed to fetch DTC information");
      }
    }
  };

  const handleDTCSelect = (dtc) => {
    setSelectedDTC(dtc);
    setDtcInput(dtc.code);
  };

  if (isLoadingAllDTCs) {
    return <div>Loading DTC codes...</div>;
  }

  if (dtcError) {
    return <div>Error loading DTC codes. Please try again later.</div>;
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
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button onClick={() => navigate(`/range-finder/${dtcInput}`)}>Range Finder: DTC</Button>
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
              ) : filteredCodes && filteredCodes.length > 0 ? (
                filteredCodes.map((code) => (
                  <TableRow key={code.code}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDTCSelect(code)}>Analyze</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No DTC codes found</TableCell>
                </TableRow>
              )}
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

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

const DTCCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCodes = useMemo(() => {
    return dtcCodes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
        </div>
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
      </div>
    </div>
  );
};

export default DTCCodes;
import { useState } from 'react';
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
  const [filteredCodes, setFilteredCodes] = useState(dtcCodes);

  const handleSearch = () => {
    const filtered = dtcCodes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCodes(filtered);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">DTC Codes Reference</h1>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search DTC codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
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
  );
};

export default DTCCodes;
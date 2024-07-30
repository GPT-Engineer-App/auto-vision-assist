import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DTCAnalysisView = ({ dtc }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">DTC Analysis: {dtc.code}</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell>{dtc.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Possible Causes</TableCell>
              <TableCell>{dtc.possible_causes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Diagnostic Aids</TableCell>
              <TableCell>{dtc.diagnostic_aids}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Application</TableCell>
              <TableCell>{dtc.application}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DTCAnalysisView;
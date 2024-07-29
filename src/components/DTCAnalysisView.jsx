import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DTCAnalysisView = ({ dtc }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dtc.code} - Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Description:</h3>
          <p>{dtc.description}</p>
          
          <h3 className="font-semibold mt-4 mb-2">Possible Causes:</h3>
          <ul className="list-disc pl-5">
            {dtc.possibleCauses.map((cause, index) => (
              <li key={index}>{cause}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mt-4 mb-2">Diagnostic Aids:</h3>
          <p>{dtc.diagnosticAids}</p>
          
          <h3 className="font-semibold mt-4 mb-2">Application:</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(dtc.application).map(([condition, action]) => (
                <TableRow key={condition}>
                  <TableCell>{condition}</TableCell>
                  <TableCell>{action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DTCAnalysisView;
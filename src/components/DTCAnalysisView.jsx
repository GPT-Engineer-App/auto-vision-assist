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
  if (!dtc) {
    return <div>No DTC data available.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>DTC Analysis: {dtc.code}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell>{dtc.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Possible Causes</TableCell>
              <TableCell>{dtc.possibleCauses}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Diagnostic Steps</TableCell>
              <TableCell>{dtc.diagnosticSteps}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Severity</TableCell>
              <TableCell>{dtc.severity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">System</TableCell>
              <TableCell>{dtc.system}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DTCAnalysisView;

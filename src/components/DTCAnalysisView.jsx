import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DTCAnalysisView = ({ components, dtcs, symptoms }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">DTC Analysis Results</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Components for Failure</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Associated DTCs</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DTC</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dtcs.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symptom</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {symptoms.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTCAnalysisView;
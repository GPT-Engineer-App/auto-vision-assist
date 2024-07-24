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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Commonly Replaced Components</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead className="text-right">Count</TableHead>
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
        <h2 className="text-lg font-semibold mb-2">Common DTCs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DTC</TableHead>
              <TableHead className="text-right">Count</TableHead>
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
        <h2 className="text-lg font-semibold mb-2">Common Symptoms</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symptom</TableHead>
              <TableHead className="text-right">Count</TableHead>
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
  );
};

export default DTCAnalysisView;
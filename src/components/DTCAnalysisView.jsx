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
        <h2 className="text-xl font-semibold mb-4">DTC to Component Matches</h2>
        <div className="flex">
          <div className="flex-1">
            <svg width="100%" height="300">
              {/* This is a placeholder for the actual SVG graph */}
              <text x="10" y="20" fill="blue">P0121</text>
              <text x="150" y="20" fill="orange">Throttle Body</text>
              <line x1="60" y1="15" x2="140" y2="15" stroke="gray" />
              
              <text x="10" y="40" fill="blue">C0242, C0900, P0121, P1235</text>
              <text x="150" y="40" fill="orange">Throttle Body Gasket</text>
              <line x1="120" y1="35" x2="140" y2="35" stroke="gray" />
              
              {/* Add more lines and text elements to represent the graph */}
            </svg>
          </div>
          <div className="w-1/4">
            <h3 className="text-sm font-semibold mb-2">Number of Repairs For C0242, C0900, P0121, P1235</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm">Throttle Body</span>
                <div className="bg-orange-400 h-4 w-full"></div>
              </div>
              <div>
                <span className="text-sm">Throttle Body Gasket</span>
                <div className="bg-blue-400 h-4 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Commonly Replaced Components</h2>
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Common DTCs</h2>
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Common Symptoms</h2>
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
    </div>
  );
};

export default DTCAnalysisView;
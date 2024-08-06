import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Gauge, Hammer } from "lucide-react";

const ProGarageView = ({ vehicles }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                <Gauge className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Engine:</strong> {vehicle.engineSize}</p>
              <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
              <p><strong>Body:</strong> {vehicle.bodyConfig}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-6 w-6 mr-2" />
              Advanced Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access to state-of-the-art diagnostic tools for all your vehicles.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hammer className="h-6 w-6 mr-2" />
              Premium Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exclusive access to premium garage tools and equipment.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProGarageView;import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Gauge, Hammer } from "lucide-react";

const ProGarageView = ({ vehicles }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                <Gauge className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Engine:</strong> {vehicle.engineSize}</p>
              <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
              <p><strong>Body:</strong> {vehicle.bodyConfig}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-6 w-6 mr-2" />
              Advanced Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access to state-of-the-art diagnostic tools for all your vehicles.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hammer className="h-6 w-6 mr-2" />
              Premium Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exclusive access to premium garage tools and equipment.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProGarageView;

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdPlaceholder = () => {
  return (
    <Card className="mt-4 bg-black/50 border border-[#ff6600]">
      <CardContent className="p-4">
        <p className="text-[#ff6600] text-center">Advertisement Placeholder</p>
      </CardContent>
    </Card>
  );
};

export default AdPlaceholder;
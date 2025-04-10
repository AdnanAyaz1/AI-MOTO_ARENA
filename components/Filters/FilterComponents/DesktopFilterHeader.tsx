import { Sliders, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const DesktopFilterHeader = ({ params, clearFilters }: { params: URLSearchParams; clearFilters: () => void }) => {
  return (
    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
      <h3 className="font-semibold text-base flex items-center">
        <Sliders className="mr-2 h-4 w-4" />
        Filters
      </h3>
      {params.size > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-sm text-gray-600"
          onClick={clearFilters}
        >
          <X className="mr-1 h-3 w-3" />
          Clear All
        </Button>
      )}
    </div>
  );
};

export default DesktopFilterHeader;

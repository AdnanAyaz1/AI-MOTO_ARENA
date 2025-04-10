"use client";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface BodyTypeFilterProps {
  bodyTypes: string[];
  selectedBodyType: string | null;
  onBodyTypeChange: (value: string) => void;
}

const BodyTypeFilter = ({
  bodyTypes,
  selectedBodyType,
  onBodyTypeChange,
}: BodyTypeFilterProps) => {
  const searchParams = useSearchParams();

  return (
    <div className="space-y-3 p-4">
      <h4 className="text-sm font-semibold flex justify-between">
        <span>Body Type</span>
        {searchParams.get("bodyType") && (
          <button
            className="text-xs text-gray-600 flex items-center cursor-pointer hover:text-gray-900"
            onClick={() => onBodyTypeChange("")}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </button>
        )}
      </h4>
      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {bodyTypes.map((bodyType) => (
          <Badge
            key={bodyType}
            variant={selectedBodyType === bodyType ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-sm ${
              selectedBodyType === bodyType
                ? "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-200"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onBodyTypeChange(bodyType)}
          >
            {bodyType}
            {selectedBodyType === bodyType && (
              <Check className="ml-1 h-3 w-3 inline" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default BodyTypeFilter;

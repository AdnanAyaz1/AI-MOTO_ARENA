"use client";
import React from "react";
import { Button } from "./ui/button";
import { Info } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="col-span-full ">
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No cars found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any cars matching your search criteria. Try adjusting
          your filters or search term.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

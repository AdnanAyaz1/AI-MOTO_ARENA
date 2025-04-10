import React from "react";
import { Slider } from "../../ui/slider";

const PriceRangeFilters = ({
  filters,
  priceRange,
  handlePriceFilter,
}: {
  filters: {
    priceRange: {
      min: number;
      max: number;
    };
  };
  priceRange: [number, number];
  handlePriceFilter: (val: [number, number]) => void;
}) => {
  return (
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-base">Price Range</h3>
      <div className="px-2">
        <Slider
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          step={100}
          value={priceRange}
          onValueChange={(val) => handlePriceFilter(val as [number, number])}
        />
      </div>
      <div className="flex items-center justify-between text-sm font-medium">
        <div>$ {priceRange[0]}</div>
        <div>$ {priceRange[1]}</div>
      </div>
    </div>
  );
};

export default PriceRangeFilters;

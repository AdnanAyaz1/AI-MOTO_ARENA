"use client";

import React from "react";
import CarFilters, { CarFiltersProps } from "./CarFilters";

interface CarFiltersWithClearProps {
  filters: CarFiltersProps;
  search: string;
}

const CarFiltersWithClear = ({ filters, search }: CarFiltersWithClearProps) => {
  return (
    <div className="space-y-4">
      <CarFilters filters={filters} />
    </div>
  );
};

export default CarFiltersWithClear;

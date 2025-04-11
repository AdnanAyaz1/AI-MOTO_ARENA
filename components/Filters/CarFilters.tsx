"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { Filter, ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import CompanyFilter from "./FilterComponents/CompanyFilter";
import BodyTypeFilter from "./FilterComponents/BodyTypeFilter";
import FuelTypeFilter from "./FilterComponents/FuelTypeFilter";
import TransmissionFilter from "./FilterComponents/TransmissionFilter";
import DesktopFilterHeader from "./FilterComponents/DesktopFilterHeader";
import PriceRangeFilters from "./FilterComponents/PriceRangeFilters";

export interface CarFiltersProps {
  company: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

const CarFilters = ({ filters }: { filters: CarFiltersProps }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortByOpen, setSortByOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min,
    filters.priceRange.max,
  ]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<
    string | null
  >(null);

  const clearFilters = () => {
    // Reset all state variables
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSelectedCompany(null);
    setSelectedBodyType(null);
    setSelectedFuelType(null);
    setSelectedTransmission(null);
    setSortBy("newest");

    // Get the current search parameter
    const currentSearch = searchParams.get("search");

    // Clear all URL parameters
    params.delete("company");
    params.delete("bodyType");
    params.delete("fuelType");
    params.delete("transmission");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sort");
    params.delete("page");

    // Preserve the search parameter if it exists
    if (currentSearch) {
      params.set("search", currentSearch);
    }

    // Update URL with preserved search parameter
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const sortValue = searchParams.get("sort");
    if (sortValue) {
      setSortBy(sortValue);
    }
    const companyParam = searchParams.get("company");
    const bodyTypeParam = searchParams.get("bodyType");
    const fuelTypeParam = searchParams.get("fuelType");
    const transmissionParam = searchParams.get("transmission");

    if (companyParam) setSelectedCompany(companyParam);
    if (bodyTypeParam) setSelectedBodyType(bodyTypeParam);
    if (fuelTypeParam) setSelectedFuelType(fuelTypeParam);
    if (transmissionParam) setSelectedTransmission(transmissionParam);
  }, [searchParams]);

  const handleFilter = (type: string, value: string) => {
    if (value === "") {
      params.delete(type);
    } else if (params.get(type) !== value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    router.push(`?${params.toString()}`);
  };

  const handleCompanyFilter = (value: string) => {
    handleFilter("company", value);

    setSelectedCompany(selectedCompany === value ? null : value);
  };

  const handleBodyTypeFilter = (value: string) => {
    handleFilter("bodyType", value);
    setSelectedBodyType(selectedBodyType === value ? null : value);
  };

  const handleFuelTypeFilter = (value: string) => {
    handleFilter("fuelType", value);
    setSelectedFuelType(selectedFuelType === value ? null : value);
  };

  const handleTransmissionFilter = (value: string) => {
    handleFilter("transmission", value);
    setSelectedTransmission(selectedTransmission === value ? null : value);
  };

  const handlePriceFilter = (value: [number, number]) => {
    setPriceRange(value);
    params.set("minPrice", value[0].toString());
    params.set("maxPrice", value[1].toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const data = [
    { value: "newest", label: "Newest First" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
  ];

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setSortByOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const sortOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortOptionsRef.current &&
        !sortOptionsRef.current.contains(event.target as Node)
      ) {
        setSortByOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex lg:flex-col justify-between gap-4 ">
      {/* Mobile Filters */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {params.size > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {params.size}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div>
                <PriceRangeFilters
                  filters={{
                    priceRange: {
                      min: filters.priceRange.min,
                      max: filters.priceRange.max,
                    },
                  }}
                  priceRange={priceRange}
                  handlePriceFilter={handlePriceFilter}
                />

                <CompanyFilter
                  companies={filters.company}
                  selectedCompany={selectedCompany}
                  onCompanyChange={handleCompanyFilter}
                />

                <BodyTypeFilter
                  bodyTypes={filters.bodyTypes}
                  selectedBodyType={selectedBodyType}
                  onBodyTypeChange={handleBodyTypeFilter}
                />

                <FuelTypeFilter
                  fuelTypes={filters.fuelTypes}
                  selectedFuelType={selectedFuelType}
                  onFuelTypeChange={handleFuelTypeFilter}
                />

                <TransmissionFilter
                  transmissions={filters.transmissions}
                  selectedTransmission={selectedTransmission}
                  onTransmissionChange={handleTransmissionFilter}
                />
              </div>

              <SheetFooter className="sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
                <Button type="button" onClick={clearFilters} className="flex-1">
                  Reset
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* SORT BY VALUE */}
      <div
        className="relative min-w-[180px] lg:w-full h-[51px] "
        ref={sortOptionsRef}
      >
        <div
          className="w-full flex items-center cursor-pointer justify-between border-gray-300 border-1 rounded-md p-2 "
          onClick={() => setSortByOpen(!sortByOpen)}
        >
          <p>{sortBy || "Sort By"}</p>
          <ChevronDown className="w-4 h-4" />
        </div>
        {sortByOpen ? (
          <div className="absolute z-50 top-full left-0 w-full bg-slate-50 shadow-md rounded-md">
            {data.map((option) => (
              <div
                key={option.value}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortByChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop Filters */}
      <div className="h-fit">
        <div className="max-lg:hidden sticky top-24">
          <div className="border rounded-lg overflow-hidden bg-white ">
            <DesktopFilterHeader params={params} clearFilters={clearFilters} />

            <PriceRangeFilters
              filters={{
                priceRange: {
                  min: filters.priceRange.min,
                  max: filters.priceRange.max,
                },
              }}
              priceRange={priceRange}
              handlePriceFilter={handlePriceFilter}
            />

            <CompanyFilter
              companies={filters.company}
              selectedCompany={selectedCompany}
              onCompanyChange={handleCompanyFilter}
            />

            <BodyTypeFilter
              bodyTypes={filters.bodyTypes}
              selectedBodyType={selectedBodyType}
              onBodyTypeChange={handleBodyTypeFilter}
            />

            <FuelTypeFilter
              fuelTypes={filters.fuelTypes}
              selectedFuelType={selectedFuelType}
              onFuelTypeChange={handleFuelTypeFilter}
            />

            <TransmissionFilter
              transmissions={filters.transmissions}
              selectedTransmission={selectedTransmission}
              onTransmissionChange={handleTransmissionFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;

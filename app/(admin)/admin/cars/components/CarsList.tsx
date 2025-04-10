"use client";
import { deleteCar } from "@/actions/deleteCar";
import { getCars } from "@/actions/getCars";

import CarTable from "@/components/Tables/CarTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { handleServerActionResponse } from "@/lib/action-utils";

import { Car } from "@prisma/client/edge";
import { CarIcon, FilterIcon, Loader2, Plus, Search } from "lucide-react";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { json } from "stream/consumers";

const CarsList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingCar, setDeletingCar] = useState<boolean>(false);
  const [priceFilterState, setPriceFilterState] = useState<boolean>(false);
  const [yearFilterState, setYearFilterState] = useState<boolean>(false);
  const [featuredState, setFeaturedState] = useState<boolean>(false);
  const [originalCarsData, setOriginalCarsData] = useState<Car[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData = originalCarsData.filter((car) => {
      return (
        car.company.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase())
      );
    });
    setCarsData(newData);
  };
  const fetchCars = async () => {
    setIsLoading(true);
    const cars = await getCars();
    setCarsData(cars);
    setOriginalCarsData(cars);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    setDeletingCar(true);
    const response = await deleteCar(carToDelete.id);
    handleServerActionResponse(response);
    setCarsData(carsData.filter((car) => car.id !== carToDelete.id));
    setDeleteDialogOpen(false);
    setCarToDelete(null);
    setDeletingCar(false);
  };

  const handleFilter = async (type: string, newData?: Car[]) => {
    if (type === "price") {
      const order = priceFilterState ? "dec" : "asc";
      setPriceFilterState((pre) => !pre);
      const newData = carsData.sort((a, b) => {
        return order === "dec"
          ? Number(b.price) - Number(a.price)
          : Number(a.price) - Number(b.price);
      });
      setCarsData(newData);
    } else if (type === "year") {
      const order = !yearFilterState ? "dec" : "asc";
      setYearFilterState((pre) => !pre);
      const newData = carsData.sort((a, b) => {
        return order === "dec"
          ? Number(b.year) - Number(a.year)
          : Number(a.year) - Number(b.year);
      });
      setCarsData(newData);
    } else if (type === "feature") {
      const state = !featuredState;
      let newData = originalCarsData.filter((car) => car.featured !== state);
      if (statusFilter) {
        newData = newData.filter(
          (car) => car.status.toLowerCase() === currentStatus
        );
      }
      setCarsData(newData);
      setFeaturedState(state);
    } else {
      setStatusFilter(true);
      const newData = originalCarsData.filter(
        (car) => car.status.toLowerCase() === type
      );

      setCurrentStatus(type);
      setCarsData(newData);
    }
  };

  const handleRestoreFilters = async () => {
    await fetchCars();
    setPriceFilterState(false);
    setYearFilterState(false);
    setFeaturedState(false);
    setStatusFilter(false);
  };

  return (
    <div className="space-y-4">
      {/* Actions and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full justify-between">
          <Button
            onClick={() => router.push("/admin/cars/create")}
            className="flex items-center"
          >
            <Plus className="h-4 w-4" />
            Add Car
          </Button>
          <Button
            variant="outline"
            onClick={handleRestoreFilters}
            className="flex items-center"
          >
            Reset Filters
          </Button>
        </div>

        {/* Simple Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search cars..."
              className="pl-9 w-full sm:w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
      {/* table */}
      {isLoading ? (
        <div className="flex flex-col h-full items-center justify-center py-12 px-4 text-center">
          <Loader2 className="h-12 w-12 text-gray-300 mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Loading...</h3>
        </div>
      ) : carsData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <h1 className="font-semibold">Car Image</h1>
              </TableHead>
              <TableHead>
                <h1 className="font-semibold">Company & Model</h1>
              </TableHead>
              <TableHead onClick={() => handleFilter("year")}>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">Year</h1>
                  <FilterIcon
                    className={`size-3 text-gray-400 hover:text-gray-600 cursor-pointer ${yearFilterState ? "rotate-180" : ""}`}
                  />
                </div>
              </TableHead>

              <TableHead
                className="flex items-center gap-2"
                onClick={() => handleFilter("price")}
              >
                <h1 className="font-semibold">Price</h1>
                <FilterIcon
                  className={`size-3 text-gray-400 hover:text-gray-600 cursor-pointer ${priceFilterState ? "rotate-180" : ""}`}
                />
              </TableHead>

              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <h1 className="font-semibold">Status</h1>
                    <FilterIcon className="size-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      Status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleFilter("available")}>
                      Available
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFilter("unavailable")}
                    >
                      UnAvailable
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilter("sold")}>
                      Sold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead
                className="flex items-center gap-2"
                onClick={() => {
                  handleFilter("feature");
                }}
              >
                <h1 className="font-semibold">Featured</h1>
                <FilterIcon
                  className={`size-3 text-gray-400 hover:text-gray-600 cursor-pointer ${featuredState ? "rotate-180" : ""}`}
                />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carsData.map((car) => (
              <CarTable
                key={car.id}
                car={car}
                setCarToDelete={setCarToDelete}
                setDeleteDialogOpen={setDeleteDialogOpen}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col h-full items-center justify-center py-12 px-4 text-center">
          <CarIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No cars found
          </h3>
          <p className="text-gray-500 mb-4">
            {search
              ? "No cars match your search criteria"
              : "Your inventory is empty. Add cars to get started."}
          </p>
          <Button onClick={() => router.push("/admin/cars/create")}>
            Add Your First Car
          </Button>
        </div>
      )}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.company}{" "}
              {carToDelete?.model} ({carToDelete?.year})? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarsList;

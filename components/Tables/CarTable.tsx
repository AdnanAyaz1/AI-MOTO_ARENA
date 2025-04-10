"use client";
import React, { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import Image from "next/image";
import { Car } from "@prisma/client/edge";
import {
  CarIcon,
  Eye,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getStatusBadge } from "@/hooks/useCarAvailability";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import router from "next/router";
import { updateCarStatus } from "@/actions/updateCarStatus";
import { handleServerActionResponse } from "@/lib/action-utils";
const CarTable = ({
  car,
  setCarToDelete,
  setDeleteDialogOpen,
}: {
  car: Car;
  setCarToDelete: (car: Car) => void;
  setDeleteDialogOpen: (open: boolean) => void;
}) => {
  const [updatingCar, setUpdatingCar] = useState<boolean>(false);
  const [featuredCar, setFeaturedCar] = useState<Boolean>(car.featured);
  const [statusCar, setStatusCar] = useState<string>(car.status);

  const handleToggleFeatured = async (car: Car) => {
    setUpdatingCar(true);
    const response = await updateCarStatus(car.id, {
      featured: !car.featured,
    });
    handleServerActionResponse(response);
    setFeaturedCar(!car.featured);
    setUpdatingCar(false);

  };

  const handleStatusUpdate = async (car: Car, newStatus: string) => {
    setUpdatingCar(true);
    const response = await updateCarStatus(car.id, { status: newStatus });
    handleServerActionResponse(response);
    setStatusCar(newStatus);
    setUpdatingCar(false);
  };

  return (
    <TableRow key={car.id}>
      <TableCell>
        {car.images && car.images.length > 0 ? (
          <Image
            src={car.images[0]}
            alt={`${car.company} ${car.model}`}
            height={40}
            width={40}
            className="w-auto h-[50px] min-w-[50%] max-w-[50%] object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">
        {car.company} {car.model}
      </TableCell>
      <TableCell>{car.year}</TableCell>
      <TableCell>{formatCurrency(Number(car.price))}</TableCell>
      <TableCell>{getStatusBadge(statusCar as string)}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-9 w-9"
          onClick={() => handleToggleFeatured(car)}
          disabled={updatingCar}
        >
          {featuredCar ? (
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-5 w-5 text-gray-400" />
          )}
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`/cars/${car.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "AVAILABLE")}
              disabled={statusCar === "AVAILABLE" || updatingCar}
            >
              Set Available
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "UNAVAILABLE")}
              disabled={statusCar === "UNAVAILABLE" || updatingCar}
            >
              Set Unavailable
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(car, "SOLD")}
              disabled={statusCar === "SOLD" || updatingCar}
            >
              Mark as Sold
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                setCarToDelete(car);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default CarTable;

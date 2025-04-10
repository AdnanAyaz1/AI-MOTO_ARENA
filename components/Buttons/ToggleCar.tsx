"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Heart } from "lucide-react";
import { saveCar } from "@/actions/saveCar";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ExtendedCar } from "@/types/types";
import { UserSavedCar } from "@prisma/client";
import Cars from "@/app/(root)/cars/page";

const ToggleCar = ({ car }: { car: ExtendedCar }) => {
  const session = useSession();
  const savedCars = car?.savedBy;
  const isSavedInitialState = (savedCars as UserSavedCar[])?.some(
    (saveCar) => saveCar?.userId === session.data?.user?.id
  );
  const [isSaved, setIsSaved] = useState(isSavedInitialState);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleSave = async () => {
    setIsToggling(true);
    try {
      const user = session.data?.user;
      if (!user) {
        return toast.error("Please Sign in to save cars");
      }
      const response = await saveCar(car.id, session.data?.user?.id as string);
      if (response.success) {
        setIsSaved(!isSaved);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-1.5 right-1.5 bg-gray-100 rounded-full p-1 ${
        isSaved
          ? "text-red-500 hover:text-red-600"
          : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={handleToggleSave}
      disabled={isToggling}
      name="toggle-car"
    >
      {isToggling ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Heart className={isSaved ? "fill-current" : ""} size={16} />
      )}
    </Button>
  );
};

export default ToggleCar;

"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { saveCar } from "@/actions/saveCar";
import { isCarSaved } from "@/actions/isCarSaved";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface SaveCarButtonProps {
  carId: string;
}

const SaveCarButton = ({ carId }: SaveCarButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      const response = await isCarSaved(carId, user.data?.id as string);
      if (response.success) {
        setIsSaved(response.data);
      }
    };
    checkSavedStatus();
    }, [carId]);

  const handleSaveCar = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await saveCar(carId, user.data?.id as string);
      if (response.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 flex-1 ${
        isSaved ? "text-red-500" : ""
      }`}
      onClick={handleSaveCar}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
};

export default SaveCarButton;

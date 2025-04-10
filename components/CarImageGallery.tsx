"use client";

import { CarIcon, Heart, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { toast } from "react-toastify";
import { saveCar } from "@/actions/saveCar";
import { ExtendedCar } from "@/types/types";
import { useSession } from "next-auth/react";
import { UserSavedCar } from "@prisma/client/edge";

interface CarImageGalleryProps {
  car: ExtendedCar;
}

const CarImageGallery = ({ car }: CarImageGalleryProps) => {
  const session = useSession();
  const isWishlistedInitialState = (car.savedBy as UserSavedCar[]).some(
    (car) => car.userId === session.data?.user?.id
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(
    isWishlistedInitialState
  );
  const [savingCar, setSavingCar] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const initialThumbnailLoading: { [key: number]: boolean } = {};

  car.images.forEach((_, i) => {
    initialThumbnailLoading[i] = true;
  });

  const [thumbnailLoading, setThumbnailLoading] = useState(
    initialThumbnailLoading
  );

  const handleThumbnailLoading = (index: number) => {
    setThumbnailLoading((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handleSaveCar = async () => {
    setSavingCar(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        return toast.error("Please Sign in to save cars");
      }
      const response = await saveCar(car.id, user.data?.id as string);
      if (response.success) {
        setIsWishlisted(!isWishlisted);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setSavingCar(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.company} ${car.model}`,
          text: `Check out this ${car.year} ${car.company} ${car.model} on Vehiql!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden relative mb-4">
        {car.images && car.images.length > 0 ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <Image
              src={car.images[currentImageIndex]}
              alt={`${car.year} ${car.company} ${car.model}`}
              height={500}
              width={500}
              className={`object-cover w-full h-[500px] aspect-video transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              priority
              onLoadingComplete={() => setIsImageLoading(false)} // use onLoadingComplete instead of onLoad
            />
          </>
        ) : (
          <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}
      </div>

      {car.images && car.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {car.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden flex-shrink-0 transition ${
                index === currentImageIndex
                  ? "border-2 border-black"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsImageLoading(true); // Reset loading state on image change
              }}
            >
              {thumbnailLoading[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
              )}
              <Image
                src={image}
                alt={`${car.year} ${car.company} ${car.model} - view ${index + 1}`}
                height={100}
                width={100}
                className="object-cover rounded-md h-20 w-24"
                onLoadingComplete={() => handleThumbnailLoading(index)} // Use onLoadingComplete for better control
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex mt-4 gap-4">
        <Button
          variant="outline"
          className={`flex items-center gap-2 flex-1 ${
            isWishlisted ? "text-red-500" : ""
          }`}
          onClick={handleSaveCar}
          disabled={savingCar}
        >
          {savingCar ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
            />
          )}
          {isWishlisted ? "Saved" : "Save"}
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 flex-1"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default CarImageGallery;

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

interface UploadCarProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const UploadCar = ({ images, setImages }: UploadCarProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative group rounded-lg border-1 border-gray-300 bg-gray-100/50"
        >
          <Image
            src={image}
            alt={`Uploaded ${index + 1}`}
            width={100}
            height={100}
            className="object-cover rounded-lg min-w-[200px] w-auto h-[100px] shadow-md"
          />
          <Button
            variant={"default"}
            onClick={() => setImages(images.filter((_, i) => i !== index))}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            asChild
          >
            <Trash size={5} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UploadCar;

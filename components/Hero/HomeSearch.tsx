"use client";

import { useState, useRef } from "react";
import { Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCarInfoAi } from "@/actions/getCarInfoAi";
import { toast } from "react-toastify";

export function HomeSearch() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextSearch = async () => {
    if (!searchTerm) {
      return;
    }
    router.push(`/cars?search=${searchTerm}`);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Process with AI
    setIsLoading(true);
    try {
      const response = await getCarInfoAi(file);
      if (response.success && response.data) {
        const { carName, company } = response.data;
        router.push(`/cars?search=${encodeURIComponent(carName)}`);
      } else {
        toast.error(
          "Could not identify the car. Please try another image or use text search."
        );
      }
    } catch (error) {
      toast.error("Error processing image with AI");
    } finally {
      setIsLoading(false);
    }
  };

  const removePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div>
      <div className="relative flex items-center px-2">
        <Input
          type="text"
          placeholder="Enter make, model, or use our AI Image Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm max-md:placeholder:max-w-[70%] max-md:placeholder:text-ellipsis"
        />

        {/* File Upload Button */}
        <div className="absolute right-[100px]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Upload
            size={35}
            className="cursor-pointer rounded-full p-1.5 hover:bg-gray-200 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>

        <Button
          className="absolute right-4 rounded-full"
          onClick={() => handleTextSearch()}
        >
          Search
        </Button>
      </div>

      {/* Display Loading State */}
      {isLoading && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700">Analyzing image...</p>
        </div>
      )}

      {/* Display Preview Image */}
      {previewImage && (
        <div className="mt-4 relative">
          <div className="relative group rounded-lg border-1 w-fit border-gray-300 bg-gray-100/50 p-1">
            <Image
              src={previewImage}
              alt="Uploaded car"
              width={200}
              height={150}
              className="object-cover rounded-lg w-auto h-[150px] shadow-md"
            />
            <Button
              variant="default"
              onClick={removePreview}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

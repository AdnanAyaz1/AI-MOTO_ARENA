"use client";
import { processCarImageWithAI } from "@/actions/createCarAi";
import UploadCar from "@/components/Cards/UploadCar";
import AddCarForm from "@/components/Forms/AddCarForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "@prisma/client/edge";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const CreateCar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("ai");
  const [extracting, setExtracting] = useState(false);
  const [carDetails, setCarDetails] = useState<
    (Car & { confidence: number }) | null
  >(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFile(file);
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage([e.target.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAiCarGenerate = async () => {
    setExtracting(true);
    if (!file) {
      toast.error("Please upload an image file");
      return;
    }
    const response = await processCarImageWithAI(file);
    if (response.success) {
      toast.success(response.message);
      setCarDetails(response.data);
      setActiveTab("manual");
    } else {
      toast.error(response.message);
    }
    setExtracting(false);
  };

  return (
    <div className="p-6">
      <Tabs
        defaultValue="ai"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-1/2 min-h-12 cursor-pointer">
          <TabsTrigger value="manual">
            <h1 className="font-medium text-lg ">Add a Car</h1>
          </TabsTrigger>
          <TabsTrigger value="ai">
            <h1 className="font-medium text-lg">Use Ai to extract details</h1>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <h1 className="text-xl font-medium my-4">Add New Car</h1>
          {carDetails && (
            <p className="text-green-600 text-md my-2">
              Car Details Extracted with {carDetails.confidence * 100}%
              confidence
            </p>
          )}
          <AddCarForm carDetails={carDetails as Car} />
        </TabsContent>
        <TabsContent value="ai">
          <h1 className="text-xl font-medium mt-6">
            Use Ai to extract details
          </h1>
          <p className="text-md text-gray-500 mt-2">
            Upload an image of a car and let Gemini AI extract its details.
          </p>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="default"
              className="cursor-pointer my-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2" size={20} />
              Upload Image
            </Button>
            {uploadedImage.length > 0 && (
              <div className="flex flex-col gap-4 items-start">
                <UploadCar
                  images={uploadedImage}
                  setImages={setUploadedImage}
                />
                <Button
                  variant="default"
                  className="cursor-pointer"
                  disabled={extracting}
                  onClick={handleAiCarGenerate}
                >
                  {extracting ? "Extracting..." : "Extract Details"}
                </Button>
                {carDetails && (
                  <p className="text-green-600 text-md my-2">
                    Car Details Extracted with {carDetails.confidence * 100}%
                    confidence
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2 text-lg">How it works</h3>
              <ol className="space-y-2 text-base text-gray-600 font-medium list-decimal pl-4">
                <li>Upload a clear image of the car</li>
                <li>Click "Extract Details" to analyze with Gemini AI</li>
                <li>Review the extracted information</li>
                <li>Fill in any missing details manually</li>
                <li>Add the car to your inventory</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-semibold text-amber-800 mb-1 text-lg  ">
                Tips for best results
              </h3>
              <ul className="space-y-1 text-base text-amber-700 font-medium">
                <li>• Use clear, well-lit images</li>
                <li>• Try to capture the entire vehicle</li>
                <li>• For difficult models, use multiple views</li>
                <li>• Always verify AI-extracted information</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateCar;

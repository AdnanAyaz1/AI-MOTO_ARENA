import { LoaderPinwheelIcon } from "lucide-react";
import React from "react";

const LoadingDialog = () => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
      <LoaderPinwheelIcon className="w-10 h-10 animate-spin text-white" />
    </div>
  );
};

export default LoadingDialog;

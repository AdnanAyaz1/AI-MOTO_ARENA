"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ClearSearchButtonsProps {
  search: string;
}

const ClearSearchButtons = ({ search }: ClearSearchButtonsProps) => {
  const router = useRouter();

  const handleClearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    router.push(`?${params.toString()}`);
  };


  return (
    <div className="flex justify-center gap-4">
      <Button variant="outline" onClick={handleClearSearch}>
        Clear Search
      </Button>
  
    </div>
  );
};

export default ClearSearchButtons;

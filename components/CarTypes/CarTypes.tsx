import { Button } from "@/components/ui/button";
import { bodyTypes } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import CarTypeCard from "./CarTypeCard";
import { getBodyTypes } from "@/actions/getBodyTypes";

const CarTypes = async () => {
  const { data: bodyTypes } = await getBodyTypes();
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Browse by Body Type</h2>
          <Button variant="default" className="flex items-center" asChild>
            <Link href="/cars">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bodyTypes &&
            bodyTypes.map((type: { bodyType: string; images: string[] }) => (
              <CarTypeCard key={type.bodyType} type={type} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default CarTypes;

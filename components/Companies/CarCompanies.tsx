import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import CompanyCard from "./CompanyCard";
import { getCompaniesWithLogos } from "@/actions/getCompanies";

interface Company {
  name: string;
  image: string;
}

const CarCompanies = async () => {
  const { data: companies } = await getCompaniesWithLogos();
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Browse by Companies</h2>
          <Button variant="default" className="flex items-center" asChild>
            <Link href="/cars">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies &&
            companies.length > 0 &&
            companies
              .slice(0, 6)
              .map((company: Company) => (
                <CompanyCard key={company.name} company={company} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default CarCompanies;

import { auth } from "@/auth";
import Benefits from "@/components/Benefits/Benefits";
import CarTypes from "@/components/CarTypes/CarTypes";
import CarCompanies from "@/components/Companies/CarCompanies";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import FeaturedCars from "@/components/FeaturedCars/FeaturedCars";
import Hero from "@/components/Hero/Hero";

export default async function Home() {


  return (
    <div className="flex flex-col pt-20 max-w-[1440px] mx-auto">
      <Hero />
      <FeaturedCars />
      <CarCompanies />
      <Benefits />
      <CarTypes />
      <FAQ />
      <CTA />
    </div>
  );
}

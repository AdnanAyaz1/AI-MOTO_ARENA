
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface props {
  company: {
    name: string;
    image: string;
  };
}

const CompanyCard = ({ company }: props) => {
  return (
    <Link
      key={company.name}
      href={`/cars?company=${company.name}`}
      className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
    >
      <Image
        src={company.name === "Ford" ? "/icons/ford.png" : company.image}
        alt={"Comapny Logo"}
        width={100}
        height={100}
        className="mx-auto object-cover object-center h-[70px] w-auto "
      />
      <h3 className="font-medium">{company.name}</h3>
    </Link>
  );
};

export default CompanyCard;

import Image from "next/image";
import Link from "next/link";
import React from "react";
import CarCardImage from "../CardImages/CarCardImage";

interface props {
  type: {
    bodyType: string;
    images: string[];
  };
}

const CarTypeCard = ({ type }: props) => {
  return (
    <Link
      key={type.bodyType}
      href={`/cars?bodyType=${type.bodyType}`}
      className="relative group cursor-pointer overflow-hidden rounded-lg "
    >
      <CarCardImage images={type.images} cartype={true}/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
        <h3 className="text-white text-xl font-bold pl-4 pb-2 ">
          {type.bodyType}
        </h3>
      </div>
    </Link>
  );
};

export default CarTypeCard;

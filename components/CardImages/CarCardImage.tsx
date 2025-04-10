"use client";
import Image from "next/image";
import React, { useState } from "react";

const CarCardImage = ({
  images,
  cartype,
}: {
  images: string[];
  cartype?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      {!cartype ? (
        <Image
          src={images[2]}
          alt={`featured car image`}
          height={160}
          width={160}
          className="object-cover object-center max-h-[160px] h-[160px] w-full rounded-tr-lg rounded-tl-lg hover:scale-105 transition duration-300"
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <Image
          src={images[1] || ``}
          alt={"Car Image"}
          height={100}
          width={100}
          className="object-cover group-hover:scale-105 transition duration-300 h-[200px] w-[350px]  "
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

export default CarCardImage;

import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

import AuthButtons from "../Buttons/AuthButtons";

const AuthFormWrapper = ({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) => {
  const title =
    type === "Sign In" ? "Sign In to your Account" : "Sign Up for an Account";
  const switchingRouteLink = type === "Sign In" ? "Sign Up" : "Sign In";
  const switchingRouteLinkPath = type === "Sign In" ? "/sign-up" : "/sign-in";
  const switchingRouteText =
    type === "Sign In" ? "Don't have an account?" : "Already have an account?";
  return (
    <div className="bg-gray-100 min-h-screen flex-center py-8 flex-col  px-4">
      <Image src={"/logo.png"} alt="Logo" height={200} width={200} className="object-contain"/>
      <h2 className="mt-3 text-3xl font-bold  text-gray-900  font-urbanist">{title}</h2>
      <div className=" mt-3 bg-white shadow-md rounded-lg px-[32px] py-[40px] w-full md:w-[520px]">
        {children}
        <p className="paragraph-regular text-center mt-[25px]">
          {switchingRouteText}{" "}
          <Link
            href={switchingRouteLinkPath}
            className="text-blue-500 font-semibold"
          >
            {switchingRouteLink}
          </Link>
        </p>
        <AuthButtons />
      </div>
    </div>
  );
};

export default AuthFormWrapper;

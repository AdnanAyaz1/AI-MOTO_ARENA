"use client";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState("");
  const handleAuth = async (provider: string) => {
    if (provider === "google") {
      setIsLoading("google");
    } else setIsLoading("github");
    await signIn(provider, {
      callbackUrl: "/",
      redirect: false,
    });
  };
  return (
    <div className="mt-[36px] flex gap-[10px]">
      <Button
        className="flex-1 py-[15px] bg-stone-100 cursor-pointer border-gray-400 rounded-lg flex-center gap-2 h-[48px]  active:scale-95 duration-150 transition-all ease-in-out"
        disabled={isLoading === "google"}
        variant={"ghost"}
        onClick={() => handleAuth("google")}
      >
        {isLoading === "google" && (
          <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
        )}
        <Image
          src={"/icons/google.svg"}
          alt="Google Logo"
          width={24}
          height={24}
        />
        <p className="paragraph-medium max-md:hidden">Login with Google</p>
      </Button>
      <Button
        variant={"ghost"}
        className="flex-1 py-[15px] bg-stone-100 cursor-pointer border-gray-400 rounded-lg flex-center gap-2 h-[48px]  active:scale-95 duration-150 transition-all ease-in-out"
        onClick={() => handleAuth("github")}
        disabled={isLoading === "github"}
      >
        {isLoading === "github" && (
          <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
        )}
        <Image
          src={"/icons/github.svg"}
          alt="Github Logo"
          width={24}
          height={24}
          className="dark:invert"
        />
        <p className="paragraph-medium max-md:hidden">Login with Github</p>
      </Button>
    </div>
  );
};

export default AuthButtons;

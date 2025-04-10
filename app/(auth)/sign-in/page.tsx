"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

import AuthForm from "@/components/Forms/AuthForm";
import { signInSchema } from "@/lib/zod-validation-schemas";
import { signIn } from "next-auth/react";



const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log("res", res);
      if (res?.error) {
        toast.error("Invalid Email or Password");
      } else {
        toast.success("Login Successfull");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="Sign In"
      schema={signInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default SignInPage;

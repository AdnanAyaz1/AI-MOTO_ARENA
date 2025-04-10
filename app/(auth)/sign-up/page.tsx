"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

import AuthForm from "@/components/Forms/AuthForm";
import { signUpSchema } from "@/lib/zod-validation-schemas";
import axios from "axios";
import { signIn } from "@/auth";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/sign-up", data);
      if (res.data.success) {
        toast.success("Registration Successful!");
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/");
      } else {
        toast.error(`${res.data.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="Sign Up"
      schema={signUpSchema}
      defaultValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default SignUpPage;

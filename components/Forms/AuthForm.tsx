import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { z } from "zod";

import SubmitButton from "@/components/Buttons/SubmitButton";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


import PasswordToggle from "../PasswordToggle";
import UsernameCheck from "../UsernameCheck";
import AuthFormWrapper from "../Wrappers/AuthFormWrapper";

interface AuthFormProps<T extends z.ZodType> {
  type: "Sign In" | "Sign Up";
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
  isLoading?: boolean;
}

const AuthForm = <T extends z.ZodType>({
  type,
  schema,
  defaultValues,
  onSubmit,
  isLoading = false,
}: AuthFormProps<T>) => {
  const [showPassword, setShowPassword] = useState({
    passwordField: false,
    confirmPasswordField: false,
  });

  const togglePasswordType = (fieldName: string) => {
    if (fieldName.toLocaleLowerCase() === "password") {
      setShowPassword((pre) => ({
        ...pre,
        passwordField: !pre.passwordField,
      }));
    }
    if (fieldName.toLocaleLowerCase() === "confirmpassword") {
      setShowPassword((pre) => ({
        ...pre,
        confirmPasswordField: !pre.confirmPasswordField,
      }));
    }
  };

  const form = useForm<z.infer<T>>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { errors } = form.formState;

  return (
    <AuthFormWrapper type={type}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<z.infer<T>>}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2.5">
                  <FormLabel className={`paragraph-medium ${errors[field.name] ? "text-red-500" : "text-gray-900"}`}>
                    {field.name === "email"
                      ? "Email Address"
                      : field.name === "confirmPassword"
                        ? "Confirm Password"
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type={
                          field.name === "password"
                            ? showPassword.passwordField
                              ? "text"
                              : "password"
                            : field.name === "confirmPassword"
                              ? showPassword.confirmPasswordField
                                ? "text"
                                : "password"
                              : "text"
                        }
                        {...field}
                        className={`paragraph-regular focus-visible:ring-0 focus-visible:border-2 outline-none min-h-12 rounded-1.5 border ${
                          errors[field.name]
                            ? "border-destructive border-2 focus-visible:border-destructive"
                            : "focus-visible:border-blue-500"
                        }`}
                      />
                      {/* Show Username Availability Indicator */}
                      {field.name === "username" && (
                        <UsernameCheck form={form} />
                      )}
                      {/* Toggle Password Visibility */}
                      {field.name?.toLocaleLowerCase().includes("password") && (
                        <PasswordToggle
                          togglePasswordType={togglePasswordType}
                          fieldName={field.name}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          ))}
          <SubmitButton
            isLoading={isLoading}
            text={type}
            disabled={Object.keys(errors).length > 0}
          />
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default AuthForm;

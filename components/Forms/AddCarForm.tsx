"use client";
import { carFormSchema } from "@/lib/zod-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import SubmitButton from "../Buttons/SubmitButton";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { carSelectValues } from "@/lib/constants";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../ui/button";
import UploadCar from "../Cards/UploadCar";
import createCar from "@/actions/createCar";
import { handleServerActionResponse } from "@/lib/action-utils";
import { redirect } from "next/navigation";
import { Car } from "@prisma/client/edge";

const AddCarForm = ({ carDetails }: { carDetails?: Car }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setuploadedImages] = useState<string[]>([]);

  const defaultValues = {
    company: carDetails?.company || "",
    model: carDetails?.model || "",
    year: (carDetails && String(carDetails?.year)) || "",
    price: (carDetails && carDetails?.price.toString().slice(1)) || "",
    mileage: (carDetails && String(carDetails?.mileage)) || "",
    color: carDetails?.color || "",
    seats: (carDetails && carDetails?.seats) || "",
    fuelType: carDetails?.fuelType || "",
    status: "AVAILABLE",
    transmission: carDetails?.transmission || "",
    bodyType: carDetails?.bodyType || "",
    description: carDetails?.description || "",
    featured: carDetails?.featured || false,
    images: carDetails?.images || [],
  };

  const defaultValuesPlaceHolders = {
    company: "e.g Toyota",
    model: "e.g Corolla",
    year: "e.g 2020",
    price: "e.g 10000",
    mileage: "e.g 10000",
    color: "e.g Red",
    fuelType: "Select Fuel Type",
    transmission: "Select Transmission",
    bodyType: "Select Body Type",
    status: "AVAILABLE",
    seats: "e.g 5",
    description: "e.g This is a description",
  };

  const form = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues: defaultValues as z.infer<typeof carFormSchema>,
  });

  const onSubmit = async (values: z.infer<typeof carFormSchema>) => {
    // Set images value before validation
    if (carDetails && uploadedImages.length === 0) {
      values.images = carDetails.images;
    } else {
      form.setValue("images", uploadedImages, {
        shouldValidate: true, // validates the form
        shouldDirty: true, // informs the react-hook-form that the form has been changed
      });
    }

    // Now get the updated values
    const updatedValues = form.getValues();

    if (updatedValues.images.length === 0) {
      form.setError("images", { message: "At least one image is required" });
      return;
    }

    const response = await createCar(updatedValues);
    const data = handleServerActionResponse(response);
    if (data) {
      redirect("/admin/cars");
    }
  };
  const handleUpload = async (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === "success" &&
      results.info &&
      typeof results.info === "object" &&
      "secure_url" in results.info
    ) {
      const newUrl = results.info.secure_url;
      setuploadedImages((prev) => {
        const updatedImages = [...prev, newUrl];
        form.clearErrors("images");
        return updatedImages;
      });
    }
  };
  const { errors } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* text inputs */}
          {Object.keys(defaultValues)
            .slice(0, 7)
            .map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<z.infer<typeof carFormSchema>>}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2.5">
                    <FormLabel
                      className={`paragraph-medium ${errors[field.name as keyof typeof errors] ? "text-red-500" : "text-gray-900"}`}
                    >
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type={"text"}
                        value={field.value as string}
                        onChange={field.onChange}
                        placeholder={
                          defaultValuesPlaceHolders[
                            field.name as keyof typeof defaultValuesPlaceHolders
                          ]
                        }
                        className={`paragraph-regular focus-visible:ring-0 focus-visible:border-2 outline-none min-h-10 rounded-1.5 border ${
                          errors[field.name as keyof typeof errors]
                            ? "border-destructive border-2 focus-visible:border-destructive"
                            : "focus-visible:border-black"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          {/* select inputs */}
          {Object.keys(defaultValues)
            .slice(7, 11)
            .map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<z.infer<typeof carFormSchema>>}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2.5">
                    <FormLabel className="paragraph-medium">
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value as string}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              defaultValuesPlaceHolders[
                                field.name as keyof typeof defaultValuesPlaceHolders
                              ]
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {carSelectValues[
                              field.name as keyof typeof carSelectValues
                            ].map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
        </div>
        {/* description input */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  required
                  placeholder="e.g This is a description"
                  className="min-h-30 rounded-1.5 border bg-white px-3 py-2  text-gray-900 placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-2 outline-none text-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* featured checkbox */}
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormControl>
                <div className="flex items-start gap-2 ">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border border-black"
                  />
                  <div className="mt-[-5px]">
                    <h1 className="text-[16px] font-medium">Featured</h1>
                    <p className="text-sm text-gray-600">
                      Featured Cars appear on the home page
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* images input */}
        <div>
          <CldUploadWidget
            uploadPreset="DevFlow"
            options={{
              multiple: true, // Enable multiple file selection
              maxFiles: 5, // Optional: Limit number of images
            }}
            onSuccessAction={handleUpload}
          >
            {({ open }) => (
              <Button
                variant={`${errors.images ? "destructive" : "secondary"}`}
                className="cursor-pointer"
                onClick={() => open()}
              >
                Upload Images
              </Button>
            )}
          </CldUploadWidget>
          {errors.images && (
            <div className="text-red-500 mt-2">{errors.images.message}</div>
          )}
        </div>

        {uploadedImages && (
          <div className="flex">
            <UploadCar images={uploadedImages} setImages={setuploadedImages} />
          </div>
        )}

        <div className="max-w-[400px] mt-8 mb-16">
          <SubmitButton isLoading={isLoading} text={"Add Car"} />
        </div>
      </form>
    </Form>
  );
};

export default AddCarForm;

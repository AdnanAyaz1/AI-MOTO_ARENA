import React from "react";
import CarsList from "./components/CarsList";

export const metadata = {
  title: "Cars | Vehiql Admin",
  description: "Manage cars in your marketplace",
};

const page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarsList />
    </div>
  );
};

export default page;

import { getUser } from "@/actions/getUser";
import { redirect } from "next/navigation";
import React from "react";
import Header from "@/components/Header";
import { Sidebar } from "./components/Sidebar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser({ protectedRoute: true });
  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <Header isAdminPage={true} />
      <Sidebar />
      <main className="md:pl-60 py-20">{children}</main>
    </div>
  );
};

export default layout;

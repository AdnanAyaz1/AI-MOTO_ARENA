import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="flex-1">{children}</section>
      <Footer />
    </div>
  );
};

export default layout;

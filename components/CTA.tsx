import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CTA = async () => {
  const user = await auth();
  const id = user?.user?.id;
  return (
    <section className="py-16 dotted-background text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Dream Car?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who found their perfect vehicle
          through our platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cars">View All Cars</Link>
          </Button>

          {id ? null : (
            <Button size="lg" asChild>
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA;

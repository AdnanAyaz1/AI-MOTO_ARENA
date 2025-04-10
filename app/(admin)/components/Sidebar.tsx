"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const Sidebar = () => {
  const pathname = usePathname();
  const handleLogOut = async () => {
    signOut();
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col overflow-y-auto bg-white shadow-sm border-r border-gray-200 mt-18 w-60 py-10">
        {/* <div className="p-6">
          <Link href="/admin">
            <h1 className="text-xl font-bold">Vehiql Admin</h1>
          </Link>
        </div> */}
        <div className="flex flex-col w-full">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50",
                pathname === route.href
                  ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700"
                  : "",
                "h-12"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-6">
          <Button
            variant={"secondary"}
            className="flex items-center gap-x-2 text-slate-500 text-sm font-medium transition-all hover:text-slate-600"
            onClick={handleLogOut}
          >
            <LogOut className="h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center text-slate-500 text-xs font-medium transition-all hover:bg-slate-100/50",
              pathname === route.href ? "text-blue-700" : "",
              "py-1 flex-1"
            )}
          >
            <route.icon
              className={cn(
                "h-6 w-6 mb-1 hover:text-slate-600",
                pathname === route.href ? "text-blue-700" : "text-slate-500"
              )}
            />
            {route.label}
          </Link>
        ))}
      </div>
    </>
  );
};

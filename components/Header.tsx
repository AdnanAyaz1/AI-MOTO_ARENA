import React from "react";

import { Heart, CarFront, Layout, ArrowLeft } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { getUser } from "@/actions/getUser";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/Avatar/UserAvatar";
import { User } from "@prisma/client/edge";

interface HeaderProps {
  isAdminPage?: boolean;
}

const Header = async ({ isAdminPage = false }: HeaderProps) => {
  const user = await getUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src={"/logo.png"}
            alt="Vehiql Logo"
            width={100}
            height={40}
            className="h-auto w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <>
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={18} />
                  <span>Back to App</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/reservations"
                className="text-gray-600  hover:text-blue-600 flex items-center gap-2"
              >
                <Button variant="secondary">
                  <CarFront size={18} />
                  <span className="hidden md:inline">My Reservations</span>
                </Button>
              </Link>

              <Link href="/saved-cars">
                <Button className="flex items-center gap-2">
                  <Heart size={18} className="" />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </>
          )}

          {!isAdminPage && !user ? (
            <Link href="/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
          ) : (
            <UserAvatar user={user as User} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

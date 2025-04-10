"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import EditUserDialog from "../Dialoges/EditUserDialog";

const UserDropDown = ({ children }: { children: React.ReactNode }) => {
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const menuItemClassName =
    "cursor-pointer hover:text-black hover:font-medium ";

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="p-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={menuItemClassName}
            onClick={() => setOpenEditUserDialog(true)}
          >
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className={menuItemClassName}
            onClick={handleLogout}
          >
            <div className="flex items-center gap-2">
              <LogOutIcon className="size-4" />
              <p>Logout</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* the custom dialog is made because the shadcn dialog does not work with cloudinary widget */}
      {
        <EditUserDialog
          open={openEditUserDialog}
          setOpen={setOpenEditUserDialog}
        />
      }
    </>
  );
};

export default UserDropDown;

'use client'
import React from "react";
import UserDropDown from "../DropDowns/UserDropDown";
import Image from "next/image";
import { User } from "@prisma/client/edge";
const UserAvatar = ({ user }: { user: User }) => {
  return (
    <UserDropDown>
      <Image
        src={(user?.imageUrl as string) || "/placeholder.jpg"}
        alt="User"
        width={40}
        height={40}
        className="w-[40px] h-[40px] rounded-full cursor-pointer hover:opacity-75 transition object-cover"
      />
    </UserDropDown>
  );
};

export default UserAvatar;

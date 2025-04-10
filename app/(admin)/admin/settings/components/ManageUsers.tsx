"use client";
import { getAllUser } from "@/actions/getAllUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client/edge";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { updateUserRole } from "@/actions/updateUserRole";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUser();
      if (res.success) {
        setUsers(res.data as User[]);
        setOriginalUsers(res.data as User[]);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData = originalUsers.filter((user) => {
      return (
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    });
    setUsers(newData);
  };

  const handleUserUpdate = async (userId: string, role: "ADMIN" | "USER") => {
    const res = await updateUserRole(userId, role);
    console.log("response => ", res);
    if (res.success) {
      setUsers((pre) => {
        return pre.map((user) => {
          if (user.id === userId) {
            return res.data as User;
          }
          return user;
        });
      });
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium my-2">Users</h1>
      <p className="text-base text-gray-500 mb-8">Manage your users here</p>
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full sm:w-auto mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-9 w-full sm:w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <h1 className="font-medium text-lg">Users</h1>
            </TableHead>
            <TableHead>
              <h1 className="font-medium text-lg">Email</h1>
            </TableHead>
            <TableHead>
              <h1 className="font-medium text-lg">Role</h1>
            </TableHead>
            <TableHead>
              <h1 className="font-medium text-lg text-right">Actions</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={user.imageUrl || "/placeholder.jpg"}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="rounded-full w-9 h-9 object-cover"
                  />
                  <h1 className="text-base font-medium">{user.username}</h1>
                </div>
              </TableCell>
              <TableCell className="text-base font-medium">
                {user.email}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {user.role === "ADMIN" ? (
                  <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full">
                    Admin
                  </span>
                ) : (
                  <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full">
                    User
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right ">
                {user.role === "ADMIN" ? (
                  <Button
                    variant={"secondary"}
                    className="text-sm"
                    onClick={() => handleUserUpdate(user.id, "USER")}
                  >
                    Remove Admin
                  </Button>
                ) : (
                  <Button
                    variant={"default"}
                    className="text-sm"
                    onClick={() => handleUserUpdate(user.id, "ADMIN")}
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageUsers;

"use client";
import EditUserForm from "../Forms/EditUserForm";

import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@prisma/client/edge";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";

const EditUserDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/user/${session.data?.user?.id}`);
      setUser(res?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error =>", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="bg-slate-900/80 backdrop-blur-3xl p-8 fixed min-h-screen inset-0 z-50 grid place-items-center overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: "2.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className={` bg-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden`}
            >
              <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
              <h3 className="text-sm text-gray-500 mb-6">
                Update your profile information
              </h3>
              {isLoading ? (
                <LoaderCircleIcon className="size-10 animate-spin" />
              ) : (
                <EditUserForm user={user as User} setOpen={setOpen} />
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditUserDialog;

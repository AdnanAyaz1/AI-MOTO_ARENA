"use client";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import CreateGroupChatModal from "../Modals/Modal";
import GroupChatForm from "../Forms/GroupChatForm";
import { ExtendedUser } from "@/types/types";

const CreateGroupChat = ({ allUsers }: { allUsers: ExtendedUser[] }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-100 cursor-pointer"
        variant={"default"}
        onClick={() => setOpenModal(true)}
      >
        <UserPlus size={15} />
      </Button>
      {openModal && (
        <CreateGroupChatModal
          onClose={() => setOpenModal(false)}
          heading="Group Chat"
          description="Create a group chat with two or more people"
        >
          <GroupChatForm users={allUsers}  />
        </CreateGroupChatModal>
      )}
    </>
  );
};

export default CreateGroupChat;

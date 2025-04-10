import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageUsers from "./components/ManageUsers";
import ManageWorkingHours from "./components/ManageWorkingHours";
const Settings = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="working-hours">
        <TabsList className="w-[50%] py-6 px-2">
          <TabsTrigger
            value="working-hours"
            className="text-lg font-medium py-4"
          >
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="users" className="text-lg font-medium py-4">
            Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="working-hours">
          <ManageWorkingHours />
        </TabsContent>
        <TabsContent value="users">
          <ManageUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

import React from "react";
import AdminNavbar from "../base/AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import { useDisclosure } from "@chakra-ui/react";

function AdminLayout({ children }: { children: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={"flex h-full min-h-screen"}>
      <AdminSidebar isOpen={isOpen} onClose={onClose}></AdminSidebar>

      <div className="h-full w-full">
        <AdminNavbar onMenuClick={onOpen}></AdminNavbar>
        <div className="mx-auto my-4 container">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;

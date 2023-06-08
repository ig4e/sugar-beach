import React from "react";
import AdminNavbar from "../base/AdminNavbar";
import AdminSidebar from "../AdminSidebar";

function AdminLayout({ children }: { children: any }) {
  return (
    <div className={"flex h-full min-h-screen"}>
      <AdminSidebar></AdminSidebar>

      <div className="h-full w-full">
        <AdminNavbar></AdminNavbar>
        <div className="m-4">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;

import React from "react";
import Navbar from "~/components/base/Navbar";

function MainLayout({ children }: { children: any }) {
  return (
    <div className={"min-h-screen"}>
      <Navbar></Navbar>
      <div className="container mx-auto mt-2 h-full flex-grow">{children}</div>
    </div>
  );
}

export default MainLayout;

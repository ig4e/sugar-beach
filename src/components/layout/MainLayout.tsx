import React from "react";
import Navbar from "~/components/base/Navbar";
import Footer from "~/components/base/Footer";

function MainLayout({ children }: { children: any }) {
  return (
    <div className={"min-h-screen"}>
      <Navbar></Navbar>
      <div className="container mx-auto mt-2 h-full flex-grow">{children}</div>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;

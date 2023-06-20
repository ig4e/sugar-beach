import React from "react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/base/Footer";

function MainLayout({ children }: { children: any }) {
  return (
    <div className={"min-h-screen flex flex-col justify-between max-w-[100vw] overflow-hidden"}>
      <Navbar></Navbar>
      <div className="container mx-auto mt-2 h-full flex-grow">{children}</div>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;

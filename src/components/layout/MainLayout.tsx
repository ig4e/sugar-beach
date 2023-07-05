import React from "react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/base/Footer";

function MainLayout({ children }: { children: any }) {
  return (
    <div className={"flex min-h-screen  flex-col justify-between"}>
      <Navbar></Navbar>
      <div className="container relative mx-auto h-full flex-grow">
        {children}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;

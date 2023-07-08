import Navbar from "~/components/navbar";
import Footer from "~/components/base/Footer";
import { type ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
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

export default Layout;

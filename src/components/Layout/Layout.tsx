import Navbar from "~/components/Navbar";
import Footer from "~/components/Base/Footer";

function Layout({ children }: { children: any }) {
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

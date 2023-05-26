import Image from "next/image";
import React from "react";
import Logo from "public/transparent-logo.png";
import ChangeRegion from "~/components/ChangeRegion";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-zinc-50 drop-shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-2">
        <span className="text-sm">© 2023 Sugar Beach</span>
        <ChangeRegion></ChangeRegion>
      </div>

      <div className="border-t-2 border-zinc-200"></div>

      <div className="container mx-auto flex items-center justify-between py-2">
        <div>
          <Image src={Logo} alt="logo" width={100} height={100}></Image>
        </div>

        <div>
          <Link href={"/auth/login"}>
            <div className="rounded-md p-2 group hover:bg-zinc-200">
              <span className="text-sm font-bold text-zinc-800 group-hover:underline">
                Sign In / Sign up
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

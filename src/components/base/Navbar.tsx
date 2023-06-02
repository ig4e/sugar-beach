import Image from "next/image";
import React from "react";
import Logo from "public/transparent-logo.png";
import ChangeRegion from "~/components/ChangeRegion";
import Cart from "~/components/Cart";
import Auth from "~/components/Auth";

import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

function Navbar() {
  return (
    <nav className="bg-zinc-50 drop-shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-2">
        <span className="text-sm text-zinc-950">© 2023 Sugar Beach</span>
        <ChangeRegion></ChangeRegion>
      </div>

      <div className="border-t-2 border-zinc-200"></div>

      <div className="container mx-auto flex items-center justify-between py-2">
        <Link href={"/"}>
          <Image src={Logo} alt="logo" width={100} height={100}></Image>
        </Link>

        <div className="flex items-center gap-4">
          <Cart></Cart>

          <Auth></Auth>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

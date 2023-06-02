import Image from "next/image";
import React from "react";
import Logo from "public/transparent-logo.png";
import ChangeRegion from "~/components/ChangeRegion";
import Cart from "~/components/Cart";
import Auth from "~/components/Auth";

import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

function AdminNavbar() {
  return (
    <nav className="bg-zinc-50">
      <div className="container mx-auto flex items-center justify-between py-3">
        <ChangeRegion></ChangeRegion>

        <Auth></Auth>
      </div>
    </nav>
  );
}

export default AdminNavbar;

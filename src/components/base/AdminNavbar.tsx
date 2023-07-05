import Image from "next/image";
import React from "react";
import Logo from "public/transparent-logo.png";
import ChangeRegion from "~/components/Navbar/ChangeRegion";
import Cart from "~/components/Navbar/Cart";
import Auth from "~/components/Navbar/Auth";

import Link from "next/link";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Bars3Icon } from "@heroicons/react/24/solid";

function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <nav className="bg-zinc-50">
      <div className="container mx-auto flex items-center justify-between gap-2 py-3">
        <HStack spacing={4}>
          <div className="md:hidden">
            <IconButton
              onClick={onMenuClick}
              icon={<Bars3Icon className="h-6 w-6"></Bars3Icon>}
              aria-label="Menu button"
            ></IconButton>
          </div>

          <Link href={"/"} className="hidden md:block">
            <Image src={Logo} alt="logo" width={80} height={80}></Image>
          </Link>
        </HStack>

        <HStack>
          <ChangeRegion></ChangeRegion>
          <Auth></Auth>
        </HStack>
      </div>
    </nav>
  );
}

export default AdminNavbar;

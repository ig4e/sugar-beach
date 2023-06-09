import Image from "next/image";
import React from "react";
import Logo from "public/transparent-logo.png";
import ChangeRegion from "~/components/ChangeRegion";
import Cart from "~/components/Cart";
import Auth from "~/components/Auth";

import Link from "next/link";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Bars3Icon } from "@heroicons/react/24/solid";

function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <nav className="bg-zinc-50">
      <div className="container mx-auto flex items-center justify-between gap-2 py-3">
        <HStack>
          <IconButton
            onClick={onMenuClick}
            icon={<Bars3Icon className="h-6 w-6"></Bars3Icon>}
            aria-label="Menu button"
          ></IconButton>

          <ChangeRegion></ChangeRegion>
        </HStack>

        <Auth></Auth>
      </div>
    </nav>
  );
}

export default AdminNavbar;

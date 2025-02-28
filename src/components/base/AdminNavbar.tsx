import Image from "next/image";
import Logo from "public/transparent-logo.png";
import Auth from "~/components/navbar/Auth";
import ChangeRegion from "~/components/navbar/ChangeRegion";

import { HStack, IconButton } from "@chakra-ui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";

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

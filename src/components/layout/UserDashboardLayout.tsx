import React from "react";
import MainLayout from "./MainLayout";
import {
  Cog6ToothIcon,
  HeartIcon,
  HomeModernIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import MenuItem from "../base/MenuItem";
import { useRouter } from "next/router";

function UserDashboardLayout({ children }: { children: any }) {
  const accountOptions = [
    { name: "My Account", href: "/@me", Icon: Cog6ToothIcon },
    { name: "My Orders", href: "/@me/orders", Icon: ShoppingBagIcon },
    { name: "My Addresses", href: "/@me/addresses", Icon: HomeModernIcon },
  ];

  const router = useRouter();

  return (
    <MainLayout>
      <div className="my-8 grid gap-8 md:[grid-template-columns:_clamp(15rem,20%,25em)_1fr;]">
        <div className="hidden h-fit flex-col gap-2 rounded-md bg-white p-4 drop-shadow md:flex">
          {accountOptions.map((option) => {
            return (
              <Link href={option.href} key={option.name}>
                <MenuItem
                  name={option.name}
                  Icon={option.Icon}
                  variant="ghost"
                  size="md"
                  active={router.pathname === option.href}
                ></MenuItem>
              </Link>
            );
          })}
        </div>
        <div>{children}</div>
      </div>
    </MainLayout>
  );
}

export default UserDashboardLayout;

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "public/transparent-logo.png";
import {
  HomeModernIcon,
  InboxStackIcon,
  RectangleGroupIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { DiscountIcon } from "./base/Icons";
import MenuItem from "./base/MenuItem";
import { useRouter } from "next/router";

const adminHomeRoutes = [
  { name: "Home", href: "/dashboard", Icon: HomeModernIcon },
];

const adminManagmentRoutesDefault = [
  { name: "Products", href: "/dashboard/products", Icon: TagIcon },
  { name: "Orders", href: "/dashboard/orders", Icon: InboxStackIcon },
  { name: "Featured", href: "/dashboard/featured", Icon: SparklesIcon },
  { name: "Discounts", href: "/dashboard/discounts", Icon: DiscountIcon },
  {
    name: "Categories",
    href: "/dashboard/categories",
    Icon: RectangleGroupIcon,
  },
];

function AdminSidebar() {
  const router = useRouter();
  const adminManagmentRoutes = useMemo(() => {
    return adminManagmentRoutesDefault.map((route) => {
      if (router.pathname.includes(route.href)) {
        return {
          ...route,
          active: true,
        };
      } else {
        return {
          ...route,
          active: false,
        };
      }
    });
  }, [router]);

  return (
    <div className="relative hidden h-full min-w-[15rem] md:block">
      <div className="fixed bottom-0 top-0 min-h-screen min-w-[15rem] border-r bg-white">
        <header className="px-6 py-3">
          <Link href={"/"}>
            <Image src={Logo} alt="logo" width={100} height={100}></Image>
          </Link>
        </header>
        <div className="h-full space-y-8 p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xs font-semibold uppercase text-pink-500">
                Home
              </h1>
              <Link href={"/dashboard"}>
                <MenuItem
                  size="sm"
                  name="Home"
                  Icon={HomeModernIcon}
                ></MenuItem>
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xs font-semibold uppercase text-pink-500">
                Management
              </h1>
              {adminManagmentRoutes.map((route) => (
                <Link href={route.href} key={route.name}>
                  <MenuItem
                    size="sm"
                    name={route.name}
                    Icon={route.Icon}
                    active={route.active}
                  ></MenuItem>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;

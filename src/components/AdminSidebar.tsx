import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay
} from "@chakra-ui/react";
import {
  HomeModernIcon,
  InboxStackIcon,
  RectangleGroupIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/transparent-logo.png";
import { useMemo } from "react";
import { DiscountIcon } from "./base/Icons";
import MenuItem from "./base/MenuItem";

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

function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p={0}>
          <div className="relative">
            <div className="fixed bottom-0 top-0 min-h-screen w-full border-r bg-white">
              <header className="flex justify-between items-start px-4 py-6">
                <Link href={"/"}>
                  <Image src={Logo} alt="logo" width={100} height={100}></Image>
                </Link>

                <DrawerCloseButton position={"inherit"} />
              </header>
              <div className="h-full space-y-8 p-4">
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default AdminSidebar;

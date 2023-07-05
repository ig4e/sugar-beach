import { HStack, useDisclosure } from "@chakra-ui/react";
import {
  HomeModernIcon,
  InboxStackIcon,
  RectangleGroupIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import {
  AppShell,
  Burger,
  Footer,
  Header,
  MediaQuery,
  Navbar,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/transparent-logo.png";
import { useMemo } from "react";
import { DiscountIcon } from "../Base/Icons";
import MenuItem from "../Base/MenuItem";
import Auth from "../Navbar/Auth";
import ChangeRegion from "../Navbar/ChangeRegion";

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

function AdminLayout({ children }: { children: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <AppShell
      navbarOffsetBreakpoint="md"
      navbar={
        <Navbar p="xs" width={{ base: 256 }} hidden={!isOpen}>
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Navbar.Section mb="md">
              <Link href={"/"}>
                <Image src={Logo} alt="logo" width={100} height={100}></Image>
              </Link>
            </Navbar.Section>
          </MediaQuery>

          <Navbar.Section grow>
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
          </Navbar.Section>

          <Navbar.Section>
            <Auth variant="menu"></Auth>
          </Navbar.Section>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <div className="flex h-full items-center justify-between text-sm font-semibold">
            <span>Admin Dashboard</span>
            <span>© 2023 Sugar Beach</span>
          </div>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={isOpen}
                onClick={() => (isOpen ? onClose() : onOpen())}
                size="sm"
                mr="xl"
              />
            </MediaQuery>

            <HStack justifyContent={"space-between"} width={"full"}>
              <HStack spacing={4}>
                <Link href={"/"} className="hidden md:block">
                  <Image src={Logo} alt="logo" width={80} height={80}></Image>
                </Link>
              </HStack>

              <HStack>
                <ChangeRegion></ChangeRegion>
                <Auth></Auth>
              </HStack>
            </HStack>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

export default AdminLayout;

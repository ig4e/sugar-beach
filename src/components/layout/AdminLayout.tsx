import { HStack, useDisclosure } from "@chakra-ui/react";
import {
  HomeModernIcon,
  InboxStackIcon,
  RectangleGroupIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { AppShell, Burger, Header, MediaQuery, Navbar } from "@mantine/core";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, useMemo } from "react";
import { DiscountIcon } from "../base/Icons";
import MenuItem from "../base/MenuItem";
import { LogoSmallTransparent } from "../logos";
import Auth from "../navbar/Auth";
import ChangeRegion from "../navbar/ChangeRegion";

const adminManagmentRoutesDefault = [
  { name: "products", href: "/dashboard/products", Icon: TagIcon },
  { name: "orders", href: "/dashboard/orders", Icon: InboxStackIcon },
  { name: "featured", href: "/dashboard/featured", Icon: SparklesIcon },
  { name: "discounts", href: "/dashboard/discounts", Icon: DiscountIcon },
  {
    name: "categories",
    href: "/dashboard/categories",
    Icon: RectangleGroupIcon,
  },
] as const;

function AdminLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("AdminLayout");
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
                <Image
                  src={LogoSmallTransparent}
                  alt="LogoSmallTransparent"
                  width={100}
                  height={100}
                ></Image>
              </Link>
            </Navbar.Section>
          </MediaQuery>

          <Navbar.Section grow>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-xs font-semibold uppercase text-pink-500">
                  {t("routes.home")}
                </h1>
                <Link href={"/dashboard"}>
                  <MenuItem
                    size="sm"
                    name={t("routes.home")}
                    Icon={HomeModernIcon}
                  ></MenuItem>
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-xs font-semibold uppercase text-pink-500">
                  {t("management")}
                </h1>
                {adminManagmentRoutes.map((route) => (
                  <Link href={route.href} key={route.name}>
                    <MenuItem
                      size="sm"
                      name={t(`routes.${route.name}`)}
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
                  <Image
                    src={LogoSmallTransparent}
                    alt="LogoSmallTransparent"
                    width={80}
                    height={80}
                  ></Image>
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
      bg={"#f4f4f5"}
    >
      {children}
    </AppShell>
  );
}

export default AdminLayout;

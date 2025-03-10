import Image from "next/image";
import Auth from "~/components/navbar/Auth";
import Cart from "~/components/navbar/Cart";
import ChangeRegion from "~/components/navbar/ChangeRegion";

import { HStack, IconButton, Tag } from "@chakra-ui/react";
import Link from "next/link";
import Search from "~/components/navbar/Search";
import SideNav from "~/components/navbar/SideNav";
import { api } from "~/utils/api";
import { LogoSmallTransparent } from "../logos";

import type { Locale } from "~/types/locale";
import useTranslation from "next-translate/useTranslation";
import { useScroll } from "~/hooks/useScroll";
import clsx from "clsx";
import { useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Navbar() {
  const categories = api.category.getAll.useQuery({ limit: 3 });
  const { t, lang } = useTranslation("common");
  const locale = lang as Locale;
  const scroll = useScroll();
  const takeFullWidth = useMemo(() => scroll > 50, [scroll > 50]);

  return (
    <>
      <div className="bg-zinc-50">
        <div className="container mx-auto flex w-full items-center justify-between py-2">
          <Link href={"/"} className="md:hidden">
            <Image
              src={LogoSmallTransparent}
              alt="logo"
              width={64}
              height={28}
            ></Image>
          </Link>
          <span className="hidden text-sm text-zinc-950 md:block">
            {t("Navbar.brand-copy")}
          </span>
          <ChangeRegion></ChangeRegion>
        </div>

        <div className="border-t-2 border-zinc-200"></div>
      </div>

      <nav
        className={
          "sticky top-0 !z-[50] bg-zinc-50 drop-shadow-lg md:max-h-20"
        }
      >
        <div
          className={clsx(
            "container !z-[50] mx-auto flex items-center justify-between gap-4 py-3 md:py-4 transition-all duration-500",
            {
              "max-w-full px-[1rem]": takeFullWidth,
            }
          )}
        >
          <div className="flex items-center gap-4">
            <Link href={"/"} className="hidden md:block">
              <Image
                src={LogoSmallTransparent}
                alt="logo"
                width={100}
                height={44}
              ></Image>
            </Link>

            <HStack>
              <SideNav></SideNav>
              <Link href={"/search"} className="md:hidden">
                <IconButton
                  icon={<MagnifyingGlassIcon className="h-5 w-5 stroke-[3]" />}
                  aria-label="Search"
                  colorScheme="gray"
                  variant={"ghost"}
                ></IconButton>
              </Link>
            </HStack>

            <div className="hidden items-center gap-4 md:flex">
              {categories.data &&
                categories.data.items.map((category) => (
                  <Link
                    key={category.id}
                    href={`/search?query=&categories=${category.id}`}
                  >
                    <Tag
                      colorScheme="gray"
                      p={"2"}
                      px={"3"}
                      borderRadius={"full"}
                    >
                      {category.name[locale]}
                    </Tag>
                  </Link>
                ))}

              <Link href={"/search?query=&categories="}>
                <Tag p={"2"} px={"3"} borderRadius={"full"}>
                  {t("Navbar.explore")}
                </Tag>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <Search></Search>
            </div>
            <Cart></Cart>
            <Auth></Auth>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

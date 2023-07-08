import Image from "next/image";
import Auth from "~/components/navbar/Auth";
import Cart from "~/components/navbar/Cart";
import ChangeRegion from "~/components/navbar/ChangeRegion";

import { Tag } from "@chakra-ui/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Search from "~/components/navbar/Search";
import SideNav from "~/components/navbar/SideNav";
import { api } from "~/utils/api";
import { LogoSmallTransparent } from "../logos";

function Navbar() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("Navbar");
  const categories = api.category.getAll.useQuery({ limit: 3 });

  return (
    <nav className="sticky top-0 !z-[1000] bg-zinc-50 drop-shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-2">
        <Link href={"/"} className="md:hidden">
          <Image
            src={LogoSmallTransparent}
            alt="logo"
            width={64}
            height={64}
          ></Image>
        </Link>
        <span className="hidden text-sm text-zinc-950 md:block">
          {t("brand-copy")}
        </span>
        <ChangeRegion></ChangeRegion>
      </div>

      <div className="border-t-2 border-zinc-200"></div>

      <div className="container mx-auto flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-8">
          <Link href={"/"} className="hidden md:block">
            <Image
              src={LogoSmallTransparent}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </Link>

          <SideNav></SideNav>

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
                {t("explore")}
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
  );
}

export default Navbar;

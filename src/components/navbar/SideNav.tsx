import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  IconButton,
  Tag,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Search from "~/components/navbar/Search";
import type { Locale } from "~/types/locale";
import { api } from "~/utils/api";
import { LogoSmallTransparent } from "../logos";

function SideNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categories = api.category.getAll.useQuery({ limit: 50 });
  const t = useTranslations("SideNav");
  const locale = useLocale() as Locale;

  return (
    <>
      <div className="block md:hidden">
        <IconButton
          variant="ghost"
          icon={<Bars3Icon className="h-6 w-6"></Bars3Icon>}
          aria-label="menu"
          colorScheme="gray"
          onClick={onOpen}
        ></IconButton>
      </div>
      <Drawer isOpen={isOpen} placement={"left"} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Link href={"/"}>
              <Image
                src={LogoSmallTransparent}
                alt="logo"
                width={100}
                height={100}
              ></Image>
            </Link>
          </DrawerHeader>
          <DrawerCloseButton />

          <DrawerBody>
            <VStack alignItems={"start"}>
              <FormControl>
                <FormLabel>{t("search")}</FormLabel>
                <Search></Search>
              </FormControl>

              <FormControl>
                <FormLabel>{t("categories")}</FormLabel>
                <div className="flex items-center gap-8">
                  <Link href={"/"} className="hidden md:block">
                    <Image
                      src={LogoSmallTransparent}
                      alt="logo"
                      width={100}
                      height={50}
                    ></Image>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4">
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
              </FormControl>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideNav;

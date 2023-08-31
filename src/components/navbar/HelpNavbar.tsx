import { cn } from "@/lib/utils";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useScroll } from "~/hooks/useScroll";
import { LogoSmallTransparent } from "../logos";
import Auth from "./Auth";
import ChangeRegion from "./ChangeRegion";
import Search from "./Search";

import {
  Badge,
  Divider,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@mantine/core";
import { Command } from "cmdk";
import { useRouter } from "next/router";
import { HELP_CENTER_PAGES } from "~/config/helpCenterConfig";
import { Locale } from "~/types/locale";
import { on } from "events";

function HelpNavbar() {
  const { t, lang } = useTranslation("common");
  const scroll = useScroll();
  const takeFullWidth = useMemo(() => scroll > 50, [scroll > 50]);

  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="bg-zinc-50">
        <div className="container mx-auto flex w-full items-center justify-between py-2">
          <Link href={"/help"} className="md:hidden">
            <HStack>
              <Image
                src={LogoSmallTransparent}
                alt="logo"
                width={64}
                height={28}
              ></Image>

              <Divider orientation={"vertical"} h={8}></Divider>

              <Heading size="sm">{t("help:help-center")}</Heading>
            </HStack>
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
          "sticky top-0 !z-[1000] bg-zinc-50 drop-shadow-lg md:max-h-20"
        }
      >
        <div
          className={cn(
            "container !z-[1000] mx-auto flex items-center justify-between gap-4 py-2 md:py-3 transition-all duration-500",
            {
              "max-w-full px-[1rem]": takeFullWidth,
            }
          )}
        >
          <div className="hidden items-center gap-4 md:flex">
            <Link href={"/help"}>
              <HStack alignItems={"center"}>
                <Image
                  src={LogoSmallTransparent}
                  alt="logo"
                  width={100}
                  height={44}
                  className="h-8 w-auto"
                ></Image>

                <Divider orientation={"vertical"} h={8}></Divider>

                <Heading size="sm" whiteSpace={"nowrap"}>
                  {t("help:help-center")}{" "}
                </Heading>
              </HStack>
            </Link>
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-max">
            <div className="w-full">
              <HelpSearch></HelpSearch>
            </div>
            <Auth></Auth>
          </div>
        </div>
      </nav>
    </>
  );
}

export function HelpSearch() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { t, lang } = useTranslation("help");
  const locale = lang as Locale;
  const router = useRouter();
  const runCommand = (command: () => void) => {
    onClose();
    command();
  };

  return (
    <>
      <Input
        icon={<MagnifyingGlassIcon className="h-5 w-5"></MagnifyingGlassIcon>}
        w={"100%"}
        placeholder={t("common:Search.search")}
        onClick={onOpen}
        onChange={onOpen}
        value={""}
      ></Input>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{ base: "full", md: "xl" }}
        closeOnEsc
        autoFocus
      >
        <ModalOverlay bgColor={"whiteAlpha.500"}></ModalOverlay>
        <ModalContent className="border border-gray-300">
          <Command label="Command Menu">
            <div className="flex items-center border-b px-3">
              <MagnifyingGlassIcon className="me-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder={t("common:Search.search")}
                className="h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 "
              />
              <IconButton
                icon={<XMarkIcon className="h-4 w-4"></XMarkIcon>}
                aria-label="Close"
                onClick={onClose}
                colorScheme="gray"
                size="xs"
              ></IconButton>
            </div>
            <Command.List
              className={cn(
                "md:max-h-[300px] overflow-y-auto overflow-x-hidden p-3"
              )}
            >
              <Command.Empty className="py-6 text-center text-sm">
                No results found.
              </Command.Empty>

              <Command.Group
                heading={t("pages")}
                className={cn(
                  "overflow-hidden text-gray-950 dark:text-gray-50 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400"
                )}
              >
                <div className=" space-y-1">
                  {HELP_CENTER_PAGES.map(({ description, path, title }) => {
                    const href = `/help/${path}`;
                    return (
                      <Command.Item
                        onSelect={() =>
                          runCommand(() => void router.push(href))
                        }
                        key={title.en}
                        className="relative flex cursor-default select-none items-center gap-4 rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50"
                      >
                        <BookOpenIcon className="h-6 w-6"></BookOpenIcon>
                        <VStack alignItems={"start"} spacing={0}>
                          <Heading
                            size={"sm"}
                            className="group-hover:underline"
                          >
                            {title[locale]}
                          </Heading>
                          <Text className="[text-wrap:balance]">
                            {description[locale]}
                          </Text>
                        </VStack>
                      </Command.Item>
                    );
                  })}
                </div>
              </Command.Group>
            </Command.List>
          </Command>
        </ModalContent>
      </Modal>
    </>
  );
}

export default HelpNavbar;

import {
  Avatar,
  Button,
  Divider,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuItem from "../base/MenuItem";
import { type User } from "@prisma/client";
import { LogoLargeDynamicPath } from "../logos";

const accountOptions = [
  { name: "my-account", href: "/@me", Icon: Cog6ToothIcon, admin: false },
  {
    name: "my-orders",
    href: "/@me/orders",
    Icon: ShoppingBagIcon,
    admin: false,
  },
  {
    name: "my-addresses",
    href: "/@me/addresses",
    Icon: HomeModernIcon,
    admin: false,
  },
  //{ name: "My Favorites", href: "/@me/favorites", Icon: HeartIcon },
  {
    name: "admin-dashboard",
    href: "/dashboard",
    Icon: AdjustmentsHorizontalIcon,
    admin: true,
  },
] as const;

import useTranslation from "next-translate/useTranslation";

function Auth({ variant = "avatar" }: { variant?: "avatar" | "menu" }) {
  const { status, data } = useSession();
  const user = data?.user as User;
  const router = useRouter();
  const { t } = useTranslation("common");

  if (status === "authenticated" && user) {
    const userAvatar = user.media?.url ?? user.image ?? LogoLargeDynamicPath;
    return (
      <div className="!z-[1000]">
        <Popover placement="top-start">
          <PopoverTrigger>
            {variant === "avatar" ? (
              <Button
                variant="outline"
                p={0}
                borderRadius={"full"}
                colorScheme="gray"
              >
                <Avatar
                  name={user.name}
                  src={userAvatar}
                  bg={"pink.500"}
                  size="sm"
                ></Avatar>
              </Button>
            ) : (
              <Button
                variant="solid"
                p={2}
                colorScheme="gray"
                width={"full"}
                size="lg"
                justifyContent={"start"}
                height={"fit-content"}
              >
                <HStack alignItems={"start"}>
                  <Avatar
                    name={user.name}
                    src={userAvatar}
                    bg={"pink.500"}
                    size="sm"
                  ></Avatar>

                  <div className="flex flex-col items-start text-xs">
                    <span className="font-semibold">{user.name}</span>
                    <span>{user.email}</span>
                  </div>
                </HStack>
              </Button>
            )}
          </PopoverTrigger>

          <PopoverContent p={4} w={"full"} maxW={"100vw"} zIndex={"modal"}>
            <PopoverArrow />
            <PopoverHeader>
              <div className="z-50 mb-2 flex items-center gap-4">
                <Avatar
                  name={user.name}
                  src={userAvatar}
                  bg={"pink.500"}
                  size="sm"
                ></Avatar>

                <div className="flex flex-col text-xs">
                  <span className="font-semibold">{user.name}</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </PopoverHeader>
            <PopoverBody className=" z-50 space-y-4" zIndex={1000}>
              <div className="grid grid-cols-2 gap-4">
                {accountOptions.map((option) => {
                  if (option.admin && user.role !== "ADMIN") return null;

                  return (
                    <Link href={option.href} key={option.name}>
                      <MenuItem
                        Icon={option.Icon}
                        name={t(`Auth.routes.${option.name}`)}
                        active={router.pathname === option.href}
                        variant="ghost"
                      ></MenuItem>
                    </Link>
                  );
                })}
              </div>
              <Divider></Divider>
              <Button
                size="sm"
                leftIcon={
                  <ArrowLeftOnRectangleIcon className="h-5 w-5"></ArrowLeftOnRectangleIcon>
                }
                variant={"solid"}
                colorScheme="red"
                onClick={() => void signOut()}
              >
                <span>{t("Auth.sign-out")}</span>
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (status === "loading")
    return (
      <Button variant="outline" p={0} borderRadius={"full"} colorScheme="gray">
        <Spinner size="md"></Spinner>
      </Button>
    );

  return (
    <Link href={"/auth/signin"}>
      <Button colorScheme="gray">
        <span className="text-sm font-semibold">{t("Auth.sign-in")}</span>
      </Button>
    </Link>
  );
}

export default Auth;

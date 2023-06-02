import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  HeartIcon,
  HomeModernIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import MenuItem from "./base/MenuItem";
import { User } from "@prisma/client";

function Auth() {
  const { status, data } = useSession();
  const user = data?.user as User;

  const accountOptions = [
    { name: "My Account", href: "/@me", Icon: Cog6ToothIcon },
    { name: "My Orders", href: "/@me/orders", Icon: ShoppingBagIcon },
    { name: "My Addresses", href: "/@me/addresses", Icon: HomeModernIcon },
    { name: "My Favorites", href: "/@me/favorites", Icon: HeartIcon },
    {
      name: "Admin Dashboard",
      href: "/dashboard",
      Icon: AdjustmentsHorizontalIcon,
      admin: true,
    },
  ];

  if (status === "authenticated") {
    return (
      <div className="z-50">
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button variant="outline" p={0} borderRadius={"full"}>
              <Avatar
                name={user.name!}
                src={user.image!}
                bg={"pink.500"}
                size="sm"
              ></Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent p={4} w={"full"} maxW={"2xl"}>
            <PopoverArrow />
            <PopoverHeader>
              <div className="mb-2 flex items-center gap-4">
                <Avatar
                  name={user.name!}
                  src={user.image!}
                  bg={"pink.500"}
                  size="sm"
                ></Avatar>

                <div className="flex flex-col text-xs">
                  <span className="font-semibold">{user.name}</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </PopoverHeader>
            <PopoverBody className="z-50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {accountOptions.map((option) => {
                  if (option.admin && user.role !== "ADMIN") return null;

                  return (
                    <Link href={option.href} key={option.name}>
                      <MenuItem
                        Icon={option.Icon}
                        name={option.name}
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
                onClick={() => signOut()}
              >
                <span>Logout</span>
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (status === "loading")
    return (
      <Button variant="outline" p={0} borderRadius={"full"}>
        <Spinner size="md"></Spinner>
      </Button>
    );

  return (
    <Link href={"/auth/login"}>
      <Button>
        <span className="text-sm font-semibold">Sign In / Sign up</span>
      </Button>
    </Link>
  );
}

export default Auth;

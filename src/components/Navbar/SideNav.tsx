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
  useDisclosure
} from "@chakra-ui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import Logo from "public/transparent-logo.png";
import { api } from "~/utils/api";
import Search from "./Search";

function SideNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categories = api.category.getAll.useQuery({ limit: 50 });

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
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Link href={"/"}>
              <Image src={Logo} alt="logo" width={100} height={100}></Image>
            </Link>
          </DrawerHeader>
          <DrawerCloseButton />

          <DrawerBody>
            <VStack alignItems={"start"}>
              <FormControl>
                <FormLabel>Search</FormLabel>
                <Search></Search>
              </FormControl>

              <FormControl>
                <FormLabel>Categories</FormLabel>
                <div className="flex items-center gap-8">
                  <Link href={"/"} className="hidden md:block">
                    <Image
                      src={Logo}
                      alt="logo"
                      width={100}
                      height={100}
                    ></Image>
                  </Link>

                  <div className="flex items-center flex-wrap gap-4">
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
                            {category.name.en}
                          </Tag>
                        </Link>
                      ))}

                    <Link href={"/search?query=&categories="}>
                      <Tag p={"2"} px={"3"} borderRadius={"full"}>
                        Explore
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

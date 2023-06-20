// import Image from "next/image";
// import React from "react";
// import Logo from "public/transparent-logo.png";
// import ChangeRegion from "~/components/ChangeRegion";
// import Cart from "~/components/Cart";
// import Auth from "~/components/Navbar/Auth";

// import Link from "next/link";
// import {
//   Button,
//   IconButton,
//   InputGroup,
//   InputLeftElement,
//   Tag,
// } from "@chakra-ui/react";
// import { useSession } from "next-auth/react";
// import Input from "./Input";
// import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import { SearchIcon } from "@chakra-ui/icons";
// import { api } from "~/utils/api";

// function Navbar() {
//   const categories = api.category.getAll.useQuery({ limit: 3 });

//   return (
//     <nav className="bg-zinc-50 drop-shadow-lg !z-[1000]">
//       <div className="container mx-auto flex items-center justify-between py-2">
//         <Link href={"/"} className="md:hidden">
//           <Image src={Logo} alt="logo" width={64} height={64}></Image>
//         </Link>
//         <span className="hidden text-sm text-zinc-950 md:block">
//           © 2023 Sugar Beach
//         </span>
//         <ChangeRegion></ChangeRegion>
//       </div>

//       <div className="border-t-2 border-zinc-200"></div>

//       <div className="container mx-auto flex items-center justify-between gap-4 py-4">
//         <div className="flex items-center gap-8">
//           <Link href={"/"} className="hidden md:block">
//             <Image src={Logo} alt="logo" width={100} height={100}></Image>
//           </Link>

//           <div className="block md:hidden">
//             <IconButton
//               variant="ghost"
//               icon={<Bars3Icon className="h-6 w-6"></Bars3Icon>}
//               aria-label="menu"
//               colorScheme="gray"
//             ></IconButton>
//           </div>

//           <div className="hidden items-center gap-4 md:flex">
//             {categories.data &&
//               categories.data.items.map((category) => (
//                 <Tag
//                   key={category.id}
//                   colorScheme="gray"
//                   p={"2"}
//                   px={"3"}
//                   borderRadius={"full"}
//                 >
//                   {category.name.en}
//                 </Tag>
//               ))}

//             <Tag p={"2"} px={"3"} borderRadius={"full"}>
//               Explore
//             </Tag>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="hidden md:flex">
//             <InputGroup>
//               <InputLeftElement pointerEvents="none">
//                 <SearchIcon color="gray.400" />
//               </InputLeftElement>
//               <Input
//                 variant={"outline"}
//                 borderRadius={"full"}
//                 placeholder="Search"
//                 paddingLeft={"9"}
//               ></Input>
//             </InputGroup>
//           </div>

//           <Cart></Cart>
//           <Auth></Auth>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import Image from "next/image";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Button } from "@chakra-ui/react";

function ChangeRegion() {
  return (
    <Button colorScheme="gray" className="flex items-center gap-2" size={"sm"}>
      <img
        src={`https://flagcdn.com/w40/sa.webp`}
        alt=""
        className="w-6 rounded"
      />
      <div className="flex items-center gap-1 text-sm">
        <span className="font-semibold">EN</span>
        <span>/</span>
        <span className="font-semibold">SAR</span>
      </div>
      <ChevronDownIcon className="h-5 w-5 text-zinc-900" />
    </Button>
  );
}

export default ChangeRegion;

import Image from "next/image";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

function ChangeRegion() {
  return (
    <button className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-200 select-none">
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
    </button>
  );
}

export default ChangeRegion;

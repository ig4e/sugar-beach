import { Button } from "@chakra-ui/react";
import React from "react";
import clsx from "clsx";

function MenuItem({
  Icon,
  name,
  size = "sm",
  active = false,
}: {
  Icon: any;
  name: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={clsx(
        "group flex w-full select-none items-center rounded-md transition",
        {
          "gap-2 p-2": size === "sm",
          "gap-4 px-3 py-2": size === "md",
          "gap-4 px-4 py-3": size === "lg",
          "bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700": active,
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200":
            !active,
        }
      )}
    >
      <Icon
        className={clsx("transition", {
          "h-5 w-5": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
        })}
      />
      <span
        className={clsx("font-medium transition", {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        })}
      >
        {name}
      </span>
    </div>
  );
}

export default MenuItem;

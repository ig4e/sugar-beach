import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function MenuItem({
  Icon,
  name,
  size = "sm",
  active = false,
  variant = "ghost",
}: {
  Icon: any;
  name: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid";
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "group flex w-full select-none items-center rounded-lg transition",
          {
            "gap-2 p-2": size === "sm",
            "gap-4 px-3 py-2": size === "md",
            "gap-4 px-4 py-3": size === "lg",
            "bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700":
              active,
            "text-gray-700 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-300":
              !active && variant === "ghost",
            "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-300":
              variant === "solid" && !active,
          }
        )
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
        className={clsx("font-medium transition whitespace-nowrap overflow-hidden text-ellipsis", {
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

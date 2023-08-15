import React, { type ReactNode } from "react";
import Footer from "../base/Footer";
import HelpNavbar from "../navbar/HelpNavbar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Anchor, Breadcrumbs } from "@mantine/core";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

function HelpLayout({
  children,
  container = true,
}: {
  children: ReactNode;
  container?: boolean;
}) {
  const router = useRouter();
  const pathes = router.pathname.split("/").filter((path) => path.length > 1);
  const { t } = useTranslation("help");

  return (
    <div className={"flex min-h-screen  flex-col justify-between"}>
      <HelpNavbar></HelpNavbar>

      <div
        className={cn("relative h-full flex-grow", {
          "container mx-auto": container,
        })}
      >
        {children}
      </div>

      <section className="container mx-auto my-4">
        <div className="border-1 relative flex overflow-hidden rounded-lg bg-gradient-to-l from-pink-500 via-orange-500 to-sky-500 p-4 md:bg-gradient-to-r md:p-2">
          <div className="z-50 flex w-full flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-white">{t("join-us")}</p>

            <Button size="sm" minW={"fit-content"} as={Link} href={"/"}>
              Start Shopping
            </Button>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
}

export default HelpLayout;

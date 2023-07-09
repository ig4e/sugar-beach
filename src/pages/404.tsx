import { Button } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import CenteredLayout from "~/components/layout/CenteredLayout";

function NotFound() {
  const t = useTranslations("404");
  return (
    <CenteredLayout>
      <div className="flex flex-col gap-4 rounded-md p-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">{t("header")}</h1>
        </div>
        <Link href="/">
          <Button className="w-full"> {t("go-back")}</Button>
        </Link>
      </div>
    </CenteredLayout>
  );
}

export default NotFound;

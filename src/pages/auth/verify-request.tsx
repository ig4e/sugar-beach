import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CenteredLayout from "~/components/layout/CenteredLayout";
import { LogoSmallTransparent } from "~/components/logos";

function VerifyRequest() {
  const session = useSession();
  const router = useRouter();
  const t = useTranslations("VerifyRequest");

  useEffect(() => {
    if (session.status === "authenticated") {
      void router.push((router.query.redirect as string) || "/");
    }
  }, [session]);

  return (
    <CenteredLayout>
      <div className="space-y-8 rounded-md bg-zinc-50 p-8 md:mx-16">
        <header>
          <Link href="/">
            <Image
              src={LogoSmallTransparent}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </Link>
        </header>

        <div className="mx-auto max-w-lg space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">{t("title")}</h1>
            <p>{t("description")}</p>
          </div>

          <Alert status="success">
            <AlertIcon />
            <AlertTitle>{t("alert.title")}</AlertTitle>
            <AlertDescription>{t("alert.description")}</AlertDescription>
          </Alert>

          <div>
            <span>© 2023 Sugar Beach</span>
          </div>
        </div>
      </div>
    </CenteredLayout>
  );
}

export default VerifyRequest;

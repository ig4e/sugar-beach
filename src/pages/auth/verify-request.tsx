import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/transparent-logo.png";
import { useEffect } from "react";
import CenteredLayout from "~/components/Layout/CenteredLayout";

function VerifyRequest() {
  const session = useSession();
  const router = useRouter();

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
            <Image src={Logo} alt="logo" width={100} height={100}></Image>
          </Link>
        </header>

        <div className="mx-auto max-w-lg space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">
              Check your email!
            </h1>
            <p>A sign in link has been sent to your email address.</p>
          </div>

          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Sent the verification link to your email!
            </AlertDescription>
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

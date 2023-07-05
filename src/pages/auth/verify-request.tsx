import React, { useEffect } from "react";
import Logo from "public/transparent-logo.png";
import Image from "next/image";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import Input from "~/components/base/Input";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import LogoFullTransparent from "public/logo-full-transparent.png";
import { signIn, useSession } from "next-auth/react";
import { Auth0Icon, DiscordIcon, GoogleIcon } from "~/components/base/Icons";
import PasswordInput from "~/components/base/PasswordInput";
import { useRouter } from "next/router";
import Link from "next/link";
import CenteredLayout from "~/components/layout/CenteredLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

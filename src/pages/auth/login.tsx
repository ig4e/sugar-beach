import React, { useEffect } from "react";
import Logo from "public/transparent-logo.png";
import Image from "next/image";
import {
  Button,
  Divider,
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
import { DiscordIcon, GoogleIcon } from "~/components/base/Icons";
import PasswordInput from "~/components/base/PasswordInput";
import { useRouter } from "next/router";
import Link from "next/link";
import CenteredLayout from "~/components/layout/CenteredLayout";

function login() {
  const session = useSession();
  const router = useRouter();

  const inputs = [
    { name: "Email", type: "email", placeholder: "Email" },
    { name: "Password", type: "password", placeholder: "Password" },
  ];

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(router.query.redirect as string || "/");
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
            <h1 className="text-2xl font-bold text-zinc-800">Welcome Back!</h1>
            <p>
              Hi there! Sign up an account and enjoy your shopping experience on
              Sugar Beach.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {inputs.map((input) => {
              return (
                <div key={input.name} className="space-y-2">
                  <Text className="text-zinc-500">{input.name}</Text>
                  {input.type === "password" && (
                    <InputGroup>
                      <InputLeftAddon
                        children={
                          <LockClosedIcon className="h-5 w-5"></LockClosedIcon>
                        }
                        bg="white"
                      />

                      <PasswordInput
                        name={input.name}
                        type={input.type}
                        placeholder={input.placeholder}
                      ></PasswordInput>
                    </InputGroup>
                  )}

                  {input.type === "email" && (
                    <InputGroup>
                      <InputLeftAddon
                        children={
                          <EnvelopeIcon className="h-5 w-5"></EnvelopeIcon>
                        }
                        bg="white"
                      />
                      <Input
                        name={input.name}
                        type={input.type}
                        placeholder={input.placeholder}
                      ></Input>
                    </InputGroup>
                  )}
                </div>
              );
            })}
          </div>

          <Button
            leftIcon={<LockClosedIcon className="h-5 w-5 "></LockClosedIcon>}
            colorScheme="pink"
            className="w-full"
            loadingText="Signing In"
          >
            Sign In
          </Button>

          <Divider></Divider>

          <div className="space-y-4">
            <Button
              onClick={() => signIn("google")}
              className="flex w-full items-center gap-2"
              variant={"outline"}
              py={2}
            >
              <GoogleIcon className="h-5 w-5"></GoogleIcon>
              <span>Sign In With Google</span>
            </Button>

            <Button
              onClick={() => signIn("discord")}
              className="flex w-full items-center gap-2"
              variant={"outline"}
              py={2}
            >
              <DiscordIcon className="h-5 w-5"></DiscordIcon>
              <span>Sign In With Discord</span>
            </Button>
          </div>

          <Divider></Divider>

          <div>
            <span>© 2023 Sugar Beach</span>
          </div>
        </div>
      </div>
    </CenteredLayout>
  );
}

export default login;

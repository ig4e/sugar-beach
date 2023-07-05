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
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/transparent-logo.png";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Auth0Icon, DiscordIcon, GoogleIcon } from "~/components/base/Icons";
import Input from "~/components/base/Input";
import CenteredLayout from "~/components/Layout/CenteredLayout";

/*
OAuthSignin: Error in constructing an authorization URL (1, 2, 3),
OAuthCallback: Error in handling the response (1, 2, 3) from an OAuth provider.
OAuthCreateAccount: Could not create OAuth provider user in the database.
EmailCreateAccount: Could not create email provider user in the database.
Callback: Error in the OAuth callback handler route
OAuthAccountNotLinked: If the email on the account is already linked, but not with this OAuth account
EmailSignin: Sending the e-mail with the verification token failed
CredentialsSignin: The authorize callback returned null in the Credentials provider. We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
SessionRequired: The content of this page requires you to be signed in at all times. See useSession for configuration.
Default: Catch all, will apply, if none of the above matched
*/

const errorMessages = {
  OAuthSignin: "Error in constructing an authorization URL (1, 2, 3)",
  OAuthCallback:
    "Error in handling the response (1, 2, 3) from an OAuth provider.",
  OAuthCreateAccount: "Could not create OAuth provider user in the database.",
  EmailCreateAccount: "Could not create email provider user in the database.",
  Callback: "Error in the OAuth callback handler route",
  OAuthAccountNotLinked:
    "If the email on the account is already linked, but not with this OAuth account",
  EmailSignin: "Sending the e-mail with the verification token failed",
  CredentialsSignin:
    "The authorize callback returned null in the Credentials provider. We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.",
  SessionRequired:
    "The content of this page requires you to be signed in at all times. See useSession for configuration.",
  Default: "Catch all, will apply, if none of the above matched",
} as const;

function Signin() {
  const session = useSession();
  const router = useRouter();
  const signinForm = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email() })),
    mode: "all",
  });

  const error = router.query.error as keyof typeof errorMessages | null;

  useEffect(() => {
    if (session.status === "authenticated") {
      void router.push((router.query.redirect as string) || "/");
    }
  }, [session]);

  return (
    <CenteredLayout>
      <div className="space-y-8 rounded-md bg-zinc-50 p-8 md:mx-16">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{errorMessages[error]}</AlertDescription>
          </Alert>
        )}

        <header>
          <Link href="/">
            <Image src={Logo} alt="logo" width={100} height={100}></Image>
          </Link>
        </header>

        <form
          className="mx-auto max-w-lg space-y-8"
          noValidate
          onSubmit={(...args) =>
            void signinForm.handleSubmit(async (data) => {
              await signIn("email", { email: data.email });
            })(...args)
          }
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Welcome Back!</h1>
            <p>
              Hi there! Sign up an account and enjoy your shopping experience on
              Sugar Beach.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormControl
              key={"email"}
              className="space-y-2"
              isInvalid={!!signinForm.formState.errors?.email}
            >
              <FormLabel className="FormLabel-zinc-500">Email</FormLabel>

              <InputGroup>
                <InputLeftAddon bg="white">
                  <EnvelopeIcon className="h-5 w-5"></EnvelopeIcon>
                </InputLeftAddon>

                <Input
                  {...signinForm.register("email")}
                  name={"email"}
                  type={"email"}
                  placeholder={"Email"}
                ></Input>
              </InputGroup>

              <FormErrorMessage>
                {signinForm.formState.errors?.email?.message}
              </FormErrorMessage>
            </FormControl>
          </div>

          <Button
            leftIcon={<LockClosedIcon className="h-5 w-5 "></LockClosedIcon>}
            colorScheme="pink"
            className="w-full"
            type="submit"
            isLoading={signinForm.formState.isSubmitting}
            loadingText="Signing In..."
          >
            Sign In
          </Button>

          <Divider></Divider>

          <div className="space-y-4">
            <Button
              onClick={() => void signIn("google")}
              className="flex w-full items-center gap-2"
              variant={"outline"}
              py={2}
              colorScheme="gray"
            >
              <GoogleIcon className="h-5 w-5"></GoogleIcon>
              <span>Sign In With Google</span>
            </Button>

            <Button
              onClick={() => void signIn("discord")}
              className="flex w-full items-center gap-2"
              variant={"outline"}
              py={2}
              colorScheme="gray"
            >
              <DiscordIcon className="h-5 w-5"></DiscordIcon>
              <span>Sign In With Discord</span>
            </Button>

            <Button
              onClick={() => void signIn("auth0")}
              className="flex w-full items-center gap-2"
              variant={"outline"}
              py={2}
              colorScheme="gray"
            >
              <Auth0Icon className="h-5 w-5"></Auth0Icon>
              <span>Auth 0</span>
            </Button>
          </div>

          <Divider></Divider>

          <div>
            <span>© 2023 Sugar Beach</span>
          </div>
        </form>
      </div>
    </CenteredLayout>
  );
}

export default Signin;

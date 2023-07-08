import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { GetStaticProps } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import AuthGaurd from "~/components/base/AuthGaurd";
import { Auth0Icon, DiscordIcon, GoogleIcon } from "~/components/base/Icons";
import Input from "~/components/base/Input";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";
import { api } from "~/utils/api";

function MyAccount() {
  const session = useSession();
  const userLinkedPlatforms = api.user.getLinkedPlatforms.useQuery({});
  const t = useTranslations("UserDashboardHome");

  if (!session.data) return;

  const { user } = session.data;

  const isGoogleLinked = userLinkedPlatforms.data?.some(
    (platform) => platform.provider === "google"
  );
  const isDiscordLinked = userLinkedPlatforms.data?.some(
    (platform) => platform.provider === "discord"
  );
  const isAuth0Linked = userLinkedPlatforms.data?.some(
    (platform) => platform.provider === "auth0"
  );

  const providers = [
    {
      id: "google",
      name: "Google",
      icon: GoogleIcon,
      isLinked: isGoogleLinked,
    },
    {
      id: "discord",
      name: "Discord",
      icon: DiscordIcon,
      isLinked: isDiscordLinked,
    },
    {
      id: "auth0",
      name: "Auth0",
      icon: Auth0Icon,
      isLinked: isAuth0Linked,
    },
  ];

  return (
    <UserDashboardLayout>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <Stack direction={["column"]}>
              <HStack justifyContent={"space-between"}>
                <div className="mb-4 flex items-center gap-4">
                  <Button
                    p={1}
                    size="xl"
                    borderRadius={"full"}
                    colorScheme="gray"
                  >
                    <Avatar
                      name={user.name}
                      src={user.image!}
                      bg={"pink.500"}
                      size="md"
                    ></Avatar>
                  </Button>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                  </div>
                </div>
                <Button>{t("info.edit")}</Button>
              </HStack>

              <FormControl>
                <FormLabel>{t("info.name")}</FormLabel>
                <HStack>
                  <Input value={user.name} isReadOnly />
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>{t("info.email")}</FormLabel>
                <HStack>
                  <Input value={user.email} isReadOnly />
                </HStack>
              </FormControl>
            </Stack>
          </CardBody>
        </Card>
        <Card height={"fit-content"}>
          <CardHeader>
            <Heading size={"sm"}>{t("account-linking")}</Heading>
          </CardHeader>
          <Divider></Divider>
          <CardBody position={"relative"}>
            <LoadingOverlay
              visible={userLinkedPlatforms.isLoading}
              overlayBlur={2}
            ></LoadingOverlay>
            <VStack>
              {providers.map((provider) => {
                return (
                  <Button
                    key={provider.id}
                    onClick={() => void signIn(provider.id)}
                    className="flex w-full items-center gap-2"
                    variant={"outline"}
                    py={2}
                    colorScheme={provider.isLinked ? "green" : "gray"}
                  >
                    <provider.icon className="h-5 w-5"></provider.icon>
                    {isGoogleLinked
                      ? `${t("linked-to")} ${provider.name}`
                      : `${t("link")} ${provider.name}`}
                  </Button>
                );
              })}
            </VStack>
          </CardBody>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || "en";

  const messages = (await import(
    `public/locales/${locale}.json`
  )) as unknown as { default: Messages };

  return {
    props: {
      messages: messages.default,
    },
  };
};
export default MyAccount;

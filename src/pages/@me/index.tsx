import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
  VStack,
  useEditableControls,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";
import Input from "~/components/base/Input";
import { CloseIcon, EditIcon, CheckIcon } from "@chakra-ui/icons";
import { Auth0Icon, DiscordIcon, GoogleIcon } from "~/components/base/Icons";
import { api } from "~/utils/api";
import { LoadingOverlay } from "@mantine/core";
import { platform } from "os";

function MyAccount() {
  const session = useSession();
  const userLinkedPlatforms = api.user.getLinkedPlatforms.useQuery({});

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

  return (
    <AuthGaurd>
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
                  <Button>Edit</Button>
                </HStack>

                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <HStack>
                    <Input value={user.name} isReadOnly />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <HStack>
                    <Input value={user.email} isReadOnly />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <HStack>
                    <Input value={user.email} isReadOnly />
                  </HStack>
                </FormControl>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Heading size={"sm"}>Account linking</Heading>
            </CardHeader>
            <Divider></Divider>
            <CardBody position={"relative"}>
              <LoadingOverlay
                visible={userLinkedPlatforms.isLoading}
                overlayBlur={2}
              ></LoadingOverlay>
              <VStack>
                <Button
                  onClick={() => void signIn("google")}
                  className="flex w-full items-center gap-2"
                  variant={"outline"}
                  py={2}
                  colorScheme={isGoogleLinked ? "green" : "gray"}
                  isDisabled={isGoogleLinked}
                >
                  <GoogleIcon className="h-5 w-5"></GoogleIcon>
                  {isGoogleLinked ? "Linked" : "Link Google"}
                </Button>
                <Button
                  onClick={() => void signIn("discord")}
                  className="flex w-full items-center gap-2"
                  variant={"outline"}
                  py={2}
                  colorScheme={isDiscordLinked ? "green" : "gray"}
                  isDisabled={isDiscordLinked}
                >
                  <DiscordIcon className="h-5 w-5"></DiscordIcon>
                  {isDiscordLinked ? "Linked" : "Link Discord"}
                </Button>
                <Button
                  onClick={() => void signIn("auth0")}
                  className="flex w-full items-center gap-2"
                  variant={"outline"}
                  py={2}
                  colorScheme={isAuth0Linked ? "green" : "gray"}
                  isDisabled={isAuth0Linked}
                >
                  <Auth0Icon className="h-5 w-5"></Auth0Icon>
                  {isAuth0Linked ? "Linked" : "Link Auth0"}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </div>
      </UserDashboardLayout>
    </AuthGaurd>
  );
}

export default MyAccount;

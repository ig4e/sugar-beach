import {
  Avatar,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOverlay } from "@mantine/core";
import { useEffect, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import Input from "../base/Input";
import { LogoLargeDynamicPath } from "../logos";
import ManageStaff from "./ManageStaff";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please type an email.",
    })
    .email(),
});

function AddStaff(props: { trigger: ReactElement; onRefetch: () => void }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const {
    data: user,
    isLoading,
    isError,
    isPaused,
    error,
    refetch,
  } = api.user.get.useQuery(
    {
      email: getValues().email,
    },
    { enabled: false, retry: false }
  );

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading user",
        description: error.message,
      });
    }
  }, [isError, error, toast]);

  const userImage = user?.media?.url ?? user?.image ?? LogoLargeDynamicPath;

  const onSubmit = handleSubmit(async () => {
    return void (await refetch());
  });

  return (
    <>
      <div onClick={onOpen}>{props.trigger}</div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody position={"relative"} minH={"16"}>
            <VStack alignItems={"start"} spacing={4} w={"full"}>
              <form
                onSubmit={(e) => void onSubmit(e)}
                className="flex w-full flex-col gap-2"
              >
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Staff email</FormLabel>
                  <Input
                    placeholder="ahmedmohamed@mail.com"
                    {...register("email")}
                  ></Input>
                  <FormHelperText>
                    The staff email address (must be registered by this email)
                  </FormHelperText>
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <Button size="sm" placeSelf={"end"} type="submit">
                  Search
                </Button>
              </form>

              <Divider />

              <div className="relative min-h-[5rem] w-full">
                {isLoading && !isPaused && (
                  <LoadingOverlay visible></LoadingOverlay>
                )}
                {user ? (
                  <HStack justifyContent={"space-between"}>
                    <HStack>
                      <Avatar
                        src={userImage}
                        name={user?.name}
                        size="md"
                      ></Avatar>
                      <VStack alignItems={"start"} spacing={0}>
                        <Text whiteSpace={"nowrap"} fontWeight={"bold"}>
                          {user?.name}
                        </Text>
                        <Text whiteSpace={"nowrap"}>{user?.email}</Text>
                      </VStack>
                    </HStack>

                    {user.role === "USER" ? (
                      <ManageStaff
                        trigger={<Button>Add</Button>}
                        userId={user.id}
                        onRefetch={props.onRefetch}
                      ></ManageStaff>
                    ) : (
                      <Button isDisabled={true}>Add</Button>
                    )}
                  </HStack>
                ) : (
                  <div>
                    <Text>No user found</Text>
                  </div>
                )}
              </div>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onClose}
              variant={"outline"}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddStaff;

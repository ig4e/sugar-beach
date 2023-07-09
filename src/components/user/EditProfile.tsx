import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { userSchema } from "~/validations/userSchema";
import Input from "../base/Input";
import { AvatarUpload } from "./AvatarUpload";
import EditEmail from "./EditEmail";

export interface EditProfileFormValues {
  name?: string;
}

function EditProfile({
  user,
  children,
  onRefetch,
}: {
  user: User;
  children: ReactNode;
  onRefetch: () => void;
}) {
  const toast = useToast();
  const t = useTranslations("EditProfile");
  const editUser = api.user.edit.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormValues>({
    mode: "onChange",
    defaultValues: { name: user.name },
    resetOptions: {
      keepDirtyValues: true,
    },
    resolver: zodResolver(userSchema),
  });

  const { isOpen, onClose, onOpen } = useDisclosure({
    onClose() {
      reset();
    },
  });

  const onSubmit = handleSubmit((values) => {
    editUser.mutate(
      {
        name: values.name,
      },
      {
        onSuccess() {
          toast({
            title: t("editProfile.success"),
            status: "success",
          });
          onClose();
          onRefetch();
        },
        onError(error) {
          toast({
            title: t("editProfile.error"),
            description: error.message,
            status: "error",
          });
          console.error(error);
        },
      }
    );
  });

  return (
    <>
      <Button variant={"unstyled"} onClick={onOpen}>
        {children}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="edit-profile-form"
              onSubmit={(e) => void onSubmit(e)}
              noValidate
            >
              <Stack direction={["column"]}>
                <HStack justifyContent={"space-between"}>
                  <Button
                    p={1}
                    size="xl"
                    borderRadius={"full"}
                    colorScheme="gray"
                  >
                    <Avatar
                      name={user.name}
                      src={user.media?.url || user.image!}
                      bg={"pink.500"}
                      size="md"
                    ></Avatar>
                  </Button>

                  <AvatarUpload onRefetch={onRefetch}></AvatarUpload>
                </HStack>

                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>{t("info.name")}</FormLabel>
                  <HStack>
                    <Input {...register("name")} />
                  </HStack>
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>{t("info.email")}</FormLabel>
                  <HStack>
                    <Input isReadOnly value={user.email} />
                    <EditEmail onRefetch={onRefetch}></EditEmail>
                  </HStack>
                </FormControl>
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} variant={"ghost"}>
              {t("cancel")}
            </Button>
            <Button form="edit-profile-form" type="submit">
              {t("save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfile;

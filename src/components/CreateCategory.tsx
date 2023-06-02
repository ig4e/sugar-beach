import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormErrorMessage,
  FormHelperText,
  Toast,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "./base/Input";
import { createCategorySchema } from "~/validations/createCategorySchema";
import { api } from "~/utils/api";

type CreateCategoryFormValues = {
  ar: string;
  en: string;
};

function CreateCategory({ onRefetch }: { onRefetch: () => void }) {
  const toast = useToast({});
  const createCategoryHook = api.category.create.useMutation();

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCategoryFormValues>({
    mode: "onChange",
    resolver: zodResolver(createCategorySchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await createCategoryHook.mutateAsync({ name: data });

      toast({
        status: "success",
        title: `Created ${result.name.en} successfully`,
      });

      onClose();
      onRefetch();
    } catch (error) {
      console.log(error);

      toast({
        status: "error",
        title: `Faild to create ${data.en}`,
      });
    }
    return "";
  });

  return (
    <div>
      <Button onClick={onOpen}>Add category</Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="new-category-form" onSubmit={onSubmit}>
              <FormControl>
                <FormLabel>Category name in English</FormLabel>
                <Input type="text" {...register("en")}></Input>
                <FormHelperText></FormHelperText>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Category name in Arabic</FormLabel>
                <Input type="text" {...register("ar")}></Input>
                <FormHelperText></FormHelperText>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                isLoading={isSubmitting}
                loadingText="Saving"
                type="submit"
                form="new-category-form"
              >
                Save
              </Button>
              <Button
                isLoading={isSubmitting}
                colorScheme="red"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateCategory;

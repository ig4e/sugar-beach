import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PencilIcon } from "@heroicons/react/24/solid";
import type { Category } from "@prisma/client";
import { api } from "~/utils/api";
import { categorySchema } from "~/validations/categorySchema";
import Input from "./base/Input";

type CategoryFormValues = {
  ar: string;
  en: string;
};

function ManageCategory({
  onRefetch,
  action,
  category,
}: {
  onRefetch: () => void;
  action: "create" | "edit";
  category?: Category;
}) {
  const toast = useToast({});
  const createCategoryHook = api.category.create.useMutation();
  const editCategoryHook = api.category.edit.useMutation();

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
  } = useForm<CategoryFormValues>({
    mode: "onChange",
    resolver: zodResolver(categorySchema),
    defaultValues: category?.name,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      let result: Category;

      if (action === "create") {
        result = await createCategoryHook.mutateAsync({ name: data });
      } else {
        result = await editCategoryHook.mutateAsync({
          id: category!.id,
          name: data,
        });
      }

      toast({
        status: "success",
        title: `${action === "create" ? "Created" : "Edited"} ${
          result.name.en
        } successfully`,
      });

      onClose();
      onRefetch();
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: `Faild to ${action === "create" ? "create" : "edit"} ${data.en}`,
      });
    }
  });

  return (
    <div>
      {action === "create" ? (
        <Button onClick={onOpen}>Add category</Button>
      ) : (
        <IconButton
          onClick={onOpen}
          icon={<PencilIcon className="h-5 w-5"></PencilIcon>}
          aria-label="edit category"
        ></IconButton>
      )}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action === "create" ? "Create new category" : "Edit category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="category-form"
              onSubmit={(...args) => void onSubmit(...args)}
              className="space-y-4"
            >
              <FormControl isInvalid={!!errors.en}>
                <FormLabel>English Category name</FormLabel>
                <Input type="text" {...register("en")}></Input>
                <FormHelperText>Category name in English.</FormHelperText>
                <FormErrorMessage>{errors.en?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.en}>
                <FormLabel>Arabic Category name</FormLabel>
                <Input type="text" {...register("ar")}></Input>
                <FormHelperText>Category name in Arabic</FormHelperText>
                <FormErrorMessage>{errors.en?.message}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                isLoading={isSubmitting}
                loadingText="Saving"
                type="submit"
                form="category-form"
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

export default ManageCategory;

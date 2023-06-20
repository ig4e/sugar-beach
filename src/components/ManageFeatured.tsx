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
  IconButton,
  ButtonGroup,
  VStack,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm, Resolver, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { yupResolver } from "@hookform/resolvers/yup";

import { DatePicker } from "@mantine/dates";
import "dayjs/locale/ar-sa";

import Input from "./base/Input";
//import { featuredSchema } from "~/validations/featuredSchema";
import { api } from "~/utils/api";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Featured, Media } from "@prisma/client";
import { NumberInput } from "@mantine/core";
//import { featuredSchema } from "~/validations/featuredSchema";
import { DevTool } from "@hookform/devtools";
import ManageProductMedia from "./ManageMedia";

type FeaturedFormValues = {
  media: Media[];
  productId: string;
};

function ManageFeatured({
  onRefetch,
  action,
  featured,
}: {
  onRefetch: () => void;
  action: "create" | "edit";
  featured?: Featured;
}) {
  const toast = useToast({});
  const createFeaturedHook = api.featured.create.useMutation();
  const editFeaturedHook = api.featured.edit.useMutation();
  const productsQuery = api.product.getAll.useQuery({ });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    getValues,
  } = useForm<FeaturedFormValues>({
    mode: "onChange",
    // resolver: zodResolver(featuredSchema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (action === "edit") {
        if (featured)
          await editFeaturedHook.mutateAsync({
            id: featured.id,
            media: data.media,
            productId: data.productId,
          });
      } else {
        await createFeaturedHook.mutateAsync({
          media: data.media,
          productId: data.productId,
        });
      }

      toast({
        status: "success",
        title: `${
          action === "create" ? "Created" : "Edited"
        } featured successfully`,
      });

      onClose();
      onRefetch();
    } catch (error) {
      toast({
        status: "error",
        title: `Failed to ${action === "create" ? "create" : "edit"} featured`,
        description: (error as any as Error)?.message,
      });
    }

    return "";
  });

  return (
    <div>
      <DevTool control={control} />
      {action === "create" ? (
        <Button onClick={onOpen}>Add featured</Button>
      ) : (
        <IconButton
          onClick={onOpen}
          icon={<PencilIcon className="h-5 w-5"></PencilIcon>}
          aria-label="edit featured"
        ></IconButton>
      )}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action === "create" ? "Create new featured" : "Edit featured"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              noValidate
              id="featured-form"
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <FormControl isRequired isInvalid={!!errors.productId}>
                <FormLabel>Featured Product</FormLabel>

                <FormHelperText>The featured product.</FormHelperText>
                <FormErrorMessage>{errors.productId?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.media}>
                <FormLabel>Featured Media</FormLabel>

                <Controller
                  control={control}
                  name="media"
                  render={({ field }) => (
                    <ManageProductMedia
                      endpoint="featuredMedia"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                ></Controller>

                <FormHelperText>The Featured media.</FormHelperText>
                <FormErrorMessage>{errors.media?.message}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                isLoading={isSubmitting}
                loadingText="Saving"
                type="submit"
                form="featured-form"
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

export default ManageFeatured;

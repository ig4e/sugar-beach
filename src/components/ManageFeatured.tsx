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
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import "dayjs/locale/ar-sa";
import Input from "./base/Input";
import { PencilIcon } from "@heroicons/react/24/solid";
import { LoadingOverlay } from "@mantine/core";
import type { Featured, Media } from "@prisma/client";
import { api } from "~/utils/api";
import { DevTool } from "@hookform/devtools";
import clsx from "clsx";
import Image from "next/image";
import { useDebounce } from "usehooks-ts";
import { featuredSchema } from "~/validations/featuredSchema";
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
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const productsQuery = api.product.getAll.useQuery({
    searchQuery:
      debouncedSearchQuery.length > 0 ? debouncedSearchQuery : undefined,
    productIDs:
      !debouncedSearchQuery && featured ? [featured?.productId] : undefined,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<FeaturedFormValues>({
    mode: "onChange",
    resolver: zodResolver(featuredSchema),
    defaultValues: {
      productId: featured?.productId || "",
      media: featured?.media || [],
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      reset();
      setSearchQuery("");
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
        description: (error as Error)?.message,
      });
    }

    return "";
  });

  const productIdValue = useWatch({ control, name: "productId" });

  return (
    <div>
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
        <DevTool control={control} />

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
              onSubmit={(...args) => void onSubmit(...args)}
              className="space-y-4"
            >
              <FormControl
                isRequired
                isInvalid={!!errors.productId}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
              >
                <FormLabel>Featured Product</FormLabel>
                <Input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  type="search"
                  placeholder="Search products"
                />

                <div className="relative grid min-h-[5rem] grid-cols-2 gap-2 rounded border border-dashed p-2">
                  <LoadingOverlay
                    visible={productsQuery.isLoading}
                    overlayBlur={2}
                  />

                  {productsQuery.data?.items.map((product) => (
                    <button
                      onClick={() =>
                        setValue("productId", product.id, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                      type="button"
                      key={product.id}
                      className={clsx(
                        "flex flex-col gap-2 rounded-md border-2  bg-zinc-50 p-2 shadow ",
                        {
                          "border-pink-600 shadow-pink-500/50":
                            productIdValue === product.id,
                        }
                      )}
                    >
                      <Image
                        src={product.media[0]?.url || ""}
                        width={100}
                        height={40}
                        className="aspect-[100/40] h-full w-full rounded-md object-cover object-center"
                        alt={product.name.en}
                      ></Image>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {product.name.en}
                        </h2>
                        <h1 className="text-base font-bold text-pink-600">
                          {product.price} SAR
                        </h1>
                      </div>
                    </button>
                  ))}
                </div>

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
                      max={1}
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

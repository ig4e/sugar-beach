import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Heading,
  IconButton,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputLeftAddon,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useMemo } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import Input from "~/components/base/Input";
import AdminLayout from "~/components/layout/AdminLayout";
import ManageProductMedia from "~/components/ManageProductMedia";
import { api } from "~/utils/api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "~/validations/productSchema";
import { Description, Media, Name } from "@prisma/client";
import { MultiSelect, NumberInput, Select } from "@mantine/core";
import { useRouter } from "next/router";
import { DevTool } from "@hookform/devtools";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import SkeletonInput from "~/components/base/SkeletonInput";

interface ProductFormValues {
  name: Name;
  media: Media[];
  description: Description;
  categories: string[];
  quantity: number;
  price: number;
  compareAtPrice?: number;
  status: "ACTIVE" | "DRAFT";
  type: string;
}

function AdminPageProduct() {
  const router = useRouter();
  const toast = useToast();
  const productId = router.query.productId as string;

  const editProductHook = api.product.edit.useMutation();
  const allCategoriesQuery = api.category.getAll.useQuery();
  const productQuery = api.product.get.useQuery({ id: productId });

  const categoriesData = useMemo(() => {
    if (!allCategoriesQuery.data) return [];
    return allCategoriesQuery.data.map((category) => ({
      value: category.id,
      label: category.name.en,
    }));
  }, [allCategoriesQuery]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    control,
    setValue,
  } = useForm<ProductFormValues>({
    mode: "onChange",
    resolver: zodResolver(productSchema),
    values: productQuery.data
      ? {
          name: productQuery.data.name,
          description: productQuery.data.description,
          categories: productQuery.data.categoryIDs,
          media: productQuery.data.media,
          quantity: productQuery.data.quantity,
          price: productQuery.data.price,
          compareAtPrice: productQuery.data.compareAtPrice || undefined,
          status: productQuery.data.status,
          type: productQuery.data.type,
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editProductHook.mutateAsync({
        id: productId,
        media: data.media,
        name: data.name,
        description: {
          ar: data.description.ar || undefined,
          en: data.description.en || undefined,
        },
        categoryIDs: data.categories,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        quantity: data.quantity,
        status: data.status,
        type: data.type,
      });

      toast({
        title: "Product edited successfully",
        status: "success",
        description: `Edited ${data.name.en} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <DevTool control={control}></DevTool>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Link href={"/dashboard/products"}>
              <IconButton
                icon={<ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>}
                aria-label="back"
                colorScheme="pink"
              />
            </Link>
            <Heading size={"md"}>Add product</Heading>
          </div>

          <form
            noValidate
            id="new-product"
            className="flex grid-cols-6 flex-col gap-x-6 gap-y-4 pb-16 md:grid"
            onSubmit={onSubmit}
          >
            <div className="fixed inset-x-0 bottom-4 z-50 flex items-center justify-center">
              <div className="mx-auto w-full max-w-2xl">
                <Alert
                  status="warning"
                  borderRadius={"md"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"full"}
                >
                  <HStack>
                    <AlertIcon />
                    <Stack direction={["column", "row"]}>
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        You have unsaved changes!
                      </AlertDescription>
                    </Stack>
                  </HStack>

                  <HStack>
                    <Button type="submit" form="new-product">
                      Save
                    </Button>

                    <Button type="button" colorScheme="gray">
                      Discard
                    </Button>
                  </HStack>
                </Alert>
              </div>
            </div>

            <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired isInvalid={!!errors.name?.en}>
                <FormLabel>English Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Oreo"
                  {...register("name.en")}
                />
                <FormHelperText>The product title.</FormHelperText>
                {errors.name?.en && (
                  <FormErrorMessage>{errors.name.en.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.name?.ar}>
                <FormLabel>Arabic Title</FormLabel>
                <Input
                  type="text"
                  placeholder="أوريو"
                  {...register("name.ar")}
                />
                <FormHelperText>The product title.</FormHelperText>
                {errors.name?.ar && (
                  <FormErrorMessage>{errors.name.ar.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired={false}>
                <FormLabel>English Description</FormLabel>
                <Textarea
                  isRequired={false}
                  required={false}
                  minHeight={"10rem"}
                  placeholder="Oreo description"
                  {...register("description.en", { required: false })}
                />
                <FormHelperText>The product description.</FormHelperText>
              </FormControl>

              <FormControl isRequired={false}>
                <FormLabel>Arabic Description</FormLabel>
                <Textarea
                  isRequired={false}
                  required={false}
                  minHeight={"10rem"}
                  placeholder="وصف الأوريو"
                  {...register("description.ar", { required: false })}
                />
                <FormHelperText>The product description.</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2 flex flex-col gap-4">
              <div className="z-40 h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        defaultValue={"ACTIVE"}
                        defaultChecked
                        data={[
                          { value: "ACTIVE", label: "Active" },
                          { value: "DRAFT", label: "Draft" },
                        ]}
                        error={fieldState.invalid}
                      ></Select>
                    )}
                  ></Controller>

                  <FormHelperText>The product listing status.</FormHelperText>
                </FormControl>
              </div>

              <div className="z-30 h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired isInvalid={!!errors.categories}>
                  <FormLabel>Categories</FormLabel>

                  <Controller
                    control={control}
                    name="categories"
                    render={({ field, fieldState }) => (
                      <MultiSelect
                        {...field}
                        disabled={allCategoriesQuery.isLoading}
                        searchable
                        data={categoriesData}
                        zIndex={1000}
                        error={fieldState.invalid}
                      ></MultiSelect>
                    )}
                  ></Controller>

                  <FormHelperText>The product categories.</FormHelperText>
                  <FormErrorMessage>
                    {errors.categories && errors.categories.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired isInvalid={!!errors.type}>
                  <FormLabel>Type</FormLabel>

                  <Input
                    type="text"
                    placeholder="Biscuts"
                    {...register("type")}
                  ></Input>
                  <FormHelperText>The product type.</FormHelperText>
                  {errors.type && (
                    <FormErrorMessage>{errors.type.message}</FormErrorMessage>
                  )}
                </FormControl>
              </div>

              <div className="h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired isInvalid={!!errors.quantity}>
                  <FormLabel>Quantity</FormLabel>

                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field, fieldState }) => (
                      <NumberInput
                        {...field}
                        className="w-full"
                        width={"100%"}
                        name="quantity"
                        min={0}
                        placeholder="10"
                        error={fieldState.invalid}
                      ></NumberInput>
                    )}
                  ></Controller>

                  <FormHelperText>The product quantity.</FormHelperText>
                  {errors.quantity && (
                    <FormErrorMessage>
                      {errors.quantity.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-span-4 flex h-full w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired isInvalid={!!errors.media}>
                <FormLabel>Media</FormLabel>
                <Controller
                  control={control}
                  name="media"
                  render={({ field }) => (
                    <ManageProductMedia
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                ></Controller>

                <FormHelperText>The product media.</FormHelperText>
                <FormErrorMessage>{errors.media?.message}</FormErrorMessage>
              </FormControl>
            </div>

            <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Price</FormLabel>
                <InputGroup w="full">
                  <InputLeftAddon children="SAR" />
                  <Controller
                    control={control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <NumberInput
                        {...field}
                        className="w-full"
                        width={"100%"}
                        min={0}
                        placeholder="10"
                        error={fieldState.invalid}
                      ></NumberInput>
                    )}
                  ></Controller>
                </InputGroup>

                <FormHelperText>The product price.</FormHelperText>
                {errors.price && (
                  <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired={false}
                isInvalid={!!errors.compareAtPrice}
              >
                <FormLabel>Compare-at price</FormLabel>
                <InputGroup w="full">
                  <InputLeftAddon children="SAR" />

                  <Controller
                    control={control}
                    name="compareAtPrice"
                    rules={{ required: false }}
                    render={({ field, fieldState }) => (
                      <NumberInput
                        {...field}
                        className="w-full"
                        width={"100%"}
                        min={0}
                        placeholder="10"
                        error={fieldState.invalid}
                      ></NumberInput>
                    )}
                  ></Controller>
                </InputGroup>

                {errors.compareAtPrice && (
                  <FormErrorMessage>
                    {errors.compareAtPrice?.message}
                  </FormErrorMessage>
                )}

                <FormHelperText>
                  To display a markdown, enter a value higher than your price.
                  shown with a strikethrough (e.g.{" "}
                  <span className="line-through">999</span>).
                </FormHelperText>
              </FormControl>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default AdminPageProduct;

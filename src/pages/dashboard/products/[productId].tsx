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
  Divider,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import Input from "~/components/base/Input";
import AdminLayout from "~/components/layout/AdminLayout";
import ManageProductMedia from "~/components/ManageMedia";
import { api } from "~/utils/api";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "~/validations/productSchema";
import { Description, Media, Name, ProductStatus } from "@prisma/client";
import { MultiSelect, NumberInput, Select } from "@mantine/core";
import { useRouter } from "next/router";
import { DevTool } from "@hookform/devtools";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { SkeletonContext, SkeletonWrap } from "~/components/base/SkeletonWrap";
import * as _ from "lodash";
import clsx from "clsx";
import { PRODUCT_STATUS } from "~/config/productConfig";
import ManageMedia from "~/components/ManageMedia";

interface ProductFormValues {
  name: Name;
  media: Media[];
  description: Description;
  categories: string[];
  quantity: number;
  price: number;
  compareAtPrice?: number;
  status: ProductStatus;
  type: string;
}

function AdminPageProduct() {
  const router = useRouter();
  const toast = useToast();
  const productId = router.query.productId as string;

  const productQuery = api.product.get.useQuery({ id: productId });

  const editProductHook = api.product.edit.useMutation();
  const allCategoriesQuery = api.category.getAll.useQuery({});
  const deleteProduct = api.product.delete.useMutation();

  const [isChanged, setIsChanged] = useState(false);

  const categoriesData = useMemo(() => {
    if (!allCategoriesQuery.data) return [];
    return allCategoriesQuery.data.items.map((category) => ({
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
    async defaultValues(payload) {
      const productData = (await productQuery.refetch()).data!;
      return {
        name: productData.name,
        description: productData.description,
        categories: productData.categoryIDs,
        media: productData.media,
        quantity: productData.quantity,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice || undefined,
        status: productData.status,
        type: productData.type,
      };
    },
  });

  const mediaValue = useWatch({ control, name: "media" });

  useEffect(() => {
    if (!productQuery.isFetched) reset();
  }, [productQuery.isFetched]);

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

      productQuery.refetch();

      toast({
        title: "Product edited successfully",
        status: "success",
        description: `Edited ${data.name.en} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (productQuery.data) {
      const formData = getValues();
      const productData = {
        name: productQuery.data.name,
        description: productQuery.data.description,
        categories: productQuery.data.categoryIDs,
        media: productQuery.data.media,
        quantity: productQuery.data.quantity,
        price: productQuery.data.price,
        compareAtPrice: productQuery.data.compareAtPrice || undefined,
        status: productQuery.data.status,
        type: productQuery.data.type,
      };

      if (!_.isEqual(productData, formData)) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
  }, [productQuery.data, getValues()]);

  function onDelete() {
    deleteProduct.mutate(
      { id: productId },
      {
        onError: (error) => {
          toast({
            title: "Failed to delete product",
            status: "error",
            description: error.message,
          });
          router.push("/dashboard/products");
        },
        onSuccess: () => {
          toast({
            title: "Product deleted successfully",
            status: "success",
            description: `Deleted ${productQuery.data?.name.en} successfully`,
          });
          router.push("/dashboard/products");
        },
      }
    );
  }
  return (
    <SkeletonContext.Provider value={productQuery.isLoading}>
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
              <SkeletonWrap>
                <Heading size={"md"}>{productQuery.data?.name.en}</Heading>
              </SkeletonWrap>
            </div>

            <form
              noValidate
              id="new-product"
              className="flex grid-cols-6 flex-col gap-x-6 gap-y-4 pb-16 md:grid"
              onSubmit={onSubmit}
            >
              <div
                className={clsx(
                  "fixed inset-x-0 bottom-4 z-50 flex items-center justify-center",
                  { hidden: !isChanged }
                )}
              >
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

                      <Link
                        href={"/dashboard/products"}
                        onClick={() => reset()}
                      >
                        <Button type="button" colorScheme="gray">
                          Discard
                        </Button>
                      </Link>
                    </HStack>
                  </Alert>
                </div>
              </div>

              <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired isInvalid={!!errors.name?.en}>
                  <FormLabel>English Title</FormLabel>
                  <SkeletonWrap>
                    <Input
                      type="text"
                      placeholder="Oreo"
                      {...register("name.en")}
                    />
                  </SkeletonWrap>

                  <FormHelperText>The product title.</FormHelperText>
                  {errors.name?.en && (
                    <FormErrorMessage>
                      {errors.name.en.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.name?.ar}>
                  <FormLabel>Arabic Title</FormLabel>
                  <SkeletonWrap>
                    <Input
                      type="text"
                      placeholder="أوريو"
                      {...register("name.ar")}
                    />
                  </SkeletonWrap>
                  <FormHelperText>The product title.</FormHelperText>
                  {errors.name?.ar && (
                    <FormErrorMessage>
                      {errors.name.ar.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired={false}>
                  <FormLabel>English Description</FormLabel>
                  <SkeletonWrap>
                    <Textarea
                      isRequired={false}
                      required={false}
                      minHeight={"10rem"}
                      placeholder="Oreo description"
                      {...register("description.en", { required: false })}
                    />
                  </SkeletonWrap>
                  <FormHelperText>The product description.</FormHelperText>
                </FormControl>

                <FormControl isRequired={false}>
                  <FormLabel>Arabic Description</FormLabel>
                  <SkeletonWrap>
                    <Textarea
                      isRequired={false}
                      required={false}
                      minHeight={"10rem"}
                      placeholder="وصف الأوريو"
                      {...register("description.ar", { required: false })}
                    />
                  </SkeletonWrap>
                  <FormHelperText>The product description.</FormHelperText>
                </FormControl>
              </div>

              <div className="col-span-2 flex flex-col gap-4">
                <div className="z-40 h-max rounded-md bg-white p-4 drop-shadow-md">
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <SkeletonWrap>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field, fieldState }) => (
                          <Select
                            ref={field.ref}
                            onChange={(value) =>
                              field.onChange(value as ProductStatus)
                            }
                            onBlur={field.onBlur}
                            value={field.value}
                            name={field.name}
                            defaultValue={"ACTIVE"}
                            defaultChecked
                            data={PRODUCT_STATUS}
                            error={fieldState.invalid}
                          ></Select>
                        )}
                      ></Controller>
                    </SkeletonWrap>

                    <FormHelperText>The product listing status.</FormHelperText>
                  </FormControl>
                </div>

                <div className="z-30 h-max rounded-md bg-white p-4 drop-shadow-md">
                  <FormControl isRequired isInvalid={!!errors.categories}>
                    <FormLabel>Categories</FormLabel>

                    <SkeletonWrap>
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
                    </SkeletonWrap>
                    <FormHelperText>The product categories.</FormHelperText>
                    <FormErrorMessage>
                      {errors.categories && errors.categories.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                <div className="h-max rounded-md bg-white p-4 drop-shadow-md">
                  <FormControl isRequired isInvalid={!!errors.type}>
                    <FormLabel>Type</FormLabel>

                    <SkeletonWrap>
                      <Input
                        type="text"
                        placeholder="Biscuts"
                        {...register("type")}
                      ></Input>
                    </SkeletonWrap>
                    <FormHelperText>The product type.</FormHelperText>
                    {errors.type && (
                      <FormErrorMessage>{errors.type.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>

                <div className="h-max rounded-md bg-white p-4 drop-shadow-md">
                  <FormControl isRequired isInvalid={!!errors.quantity}>
                    <FormLabel>Quantity</FormLabel>

                    <SkeletonWrap>
                      <Controller
                        control={control}
                        name="quantity"
                        render={({ field, fieldState }) => (
                          <NumberInput
                            ref={field.ref}
                            onChange={(value) => field.onChange(Number(value))}
                            onBlur={field.onBlur}
                            value={field.value}
                            name={field.name}
                            className="w-full"
                            width={"100%"}
                            min={0}
                            placeholder="10"
                            error={fieldState.invalid}
                          ></NumberInput>
                        )}
                      ></Controller>
                    </SkeletonWrap>

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

                  <SkeletonWrap>
                    <div>
                      <ManageMedia
                        endpoint="productMedia"
                        value={mediaValue}
                        onChange={(value) => setValue("media", value)}
                      />
                    </div>
                  </SkeletonWrap>

                  <FormHelperText>The product media.</FormHelperText>
                  <FormErrorMessage>{errors.media?.message}</FormErrorMessage>
                </FormControl>
              </div>

              <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired isInvalid={!!errors.price}>
                  <FormLabel>Price</FormLabel>
                  <SkeletonWrap>
                    <InputGroup w="full">
                      <InputLeftAddon children="SAR" />
                      <Controller
                        control={control}
                        name="price"
                        render={({ field, fieldState }) => (
                          <NumberInput
                            ref={field.ref}
                            onChange={(value) => field.onChange(Number(value))}
                            onBlur={field.onBlur}
                            value={field.value}
                            name={field.name}
                            className="w-full"
                            width={"100%"}
                            min={0}
                            placeholder="10"
                            error={fieldState.invalid}
                            precision={2}
                          ></NumberInput>
                        )}
                      ></Controller>
                    </InputGroup>
                  </SkeletonWrap>

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
                  <SkeletonWrap>
                    <InputGroup w="full">
                      <InputLeftAddon children="SAR" />
                      <Controller
                        control={control}
                        name="compareAtPrice"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                          <NumberInput
                            ref={field.ref}
                            onChange={(value) =>
                              value === ""
                                ? field.onChange(0)
                                : field.onChange(Number(value))
                            }
                            onBlur={field.onBlur}
                            value={field.value}
                            name={field.name}
                            className="w-full"
                            width={"100%"}
                            min={0}
                            placeholder="10"
                            precision={2}
                            error={fieldState.invalid}
                            required={false}
                          ></NumberInput>
                        )}
                      ></Controller>
                    </InputGroup>
                  </SkeletonWrap>

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

            <Divider></Divider>
            <HStack justifyContent={"end"}>
              <Button colorScheme="blackAlpha" variant={"outline"}>
                Archive Product
              </Button>
              <Button colorScheme="red" variant={"outline"} onClick={onDelete}>
                Delete Product
              </Button>
            </HStack>
          </div>
        </AdminLayout>
      </AuthGaurd>
    </SkeletonContext.Provider>
  );
}

export default AdminPageProduct;

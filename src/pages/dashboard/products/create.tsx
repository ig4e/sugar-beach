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
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useMemo } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import Input from "~/components/base/Input";
import AdminLayout from "~/components/layout/AdminLayout";
import UploadProductMedia, { type File } from "~/components/UploadProductMedia";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "~/validations/productSchema";
import { Description, Name } from "@prisma/client";
import { MultiSelect, NumberInput, Select } from "@mantine/core";

interface ProductFormValues {
  media: string[];
  name: Name;
  description: Description;
  categories: string[];
  quantity: number;
  price: number;
  compareAtPrice?: number;
  status: "ACTIVE" | "DRAFT";
  type: string;
}

function create() {
  const toast = useToast();
  const createProductHook = api.product.create.useMutation();
  const allCategoriesQuery = api.category.getAll.useQuery();
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
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createProductHook.mutateAsync({
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
        title: "Product created",
        status: "success",
        description: `Created ${data.name.en} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
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
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      You have unsaved changes!
                    </AlertDescription>
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
                  <Select
                    name="status"
                    defaultValue={"ACTIVE"}
                    defaultChecked
                    data={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "DRAFT", label: "Draft" },
                    ]}
                  ></Select>
                  <FormHelperText>The product listing status.</FormHelperText>
                </FormControl>
              </div>

              <div className="z-30 h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired>
                  <FormLabel>Categories</FormLabel>

                  <MultiSelect
                    name="categories"
                    disabled={allCategoriesQuery.isLoading}
                    searchable
                    data={categoriesData}
                    zIndex={1000}
                  ></MultiSelect>
                  <FormHelperText>The product categories.</FormHelperText>
                  <FormErrorMessage>
                    The product must have at least one category.
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
                  <NumberInput
                    className="w-full"
                    width={"100%"}
                    name="quantity"
                    min={0}
                    placeholder="10"
                    error=""
                  ></NumberInput>
                  <FormHelperText>The product quantity.</FormHelperText>
                  {errors.quantity && (
                    <FormErrorMessage>
                      {errors.quantity.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-span-4 flex min-h-[16rem] w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired isInvalid={!!errors.media}>
                <FormLabel>Media</FormLabel>
                <div>
                  <UploadProductMedia
                    onChange={(fileURLs) => {
                      setValue("media", fileURLs);
                    }}
                  ></UploadProductMedia>
                </div>
                <FormHelperText>The product title media.</FormHelperText>
                <FormErrorMessage>Product media is required.</FormErrorMessage>
              </FormControl>
            </div>

            <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Price</FormLabel>
                <InputGroup w="full">
                  <InputLeftAddon children="SAR" />
                  <NumberInput
                    className="w-full"
                    name="price"
                    min={0}
                    placeholder="899"
                    error=""
                  ></NumberInput>
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

                  <NumberInput
                    className="h-full w-full"
                    name="compareAtPrice"
                    min={0}
                    placeholder="999"
                    required={false}
                    error=""
                  ></NumberInput>
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

export default create;

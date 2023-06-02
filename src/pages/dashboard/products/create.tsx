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
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { UploadButton } from "@uploadthing/react";
import Link from "next/link";
import React, { useMemo } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import Input from "~/components/base/Input";
import AdminLayout from "~/components/layout/AdminLayout";
import { OurFileRouter } from "~/server/uploadthing";
import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import UploadProductMedia from "~/components/UploadProductMedia";
import { MultiSelect, Select } from "@mantine/core";
import { api } from "~/utils/api";

function create() {
  const allCategoriesQuery = api.category.getAll.useQuery();
  const categoriesData = useMemo(() => {
    if (!allCategoriesQuery.data) return [];
    return allCategoriesQuery.data.map((category) => ({
      value: category.id,
      label: category.name.en,
    }));
  }, [allCategoriesQuery]);

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

          <div className="grid grid-cols-6 gap-x-6 gap-y-4">
            <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired>
                <FormLabel>English Title</FormLabel>
                <Input type="text" placeholder="Short sleeve t-shirt" />
                <FormHelperText>The product title.</FormHelperText>
                <FormErrorMessage>Product title is required.</FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Arabic Title</FormLabel>
                <Input type="text" placeholder="Short sleeve t-shirt" />
                <FormHelperText>The product title.</FormHelperText>
                <FormErrorMessage>Product title is required.</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  minHeight={"10rem"}
                  placeholder="Short sleeve t-shirt"
                />
                <FormHelperText>The product description.</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2 flex flex-col gap-4">
              <div className="z-40 h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
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
                    className=""
                    disabled={allCategoriesQuery.isLoading}
                    searchable
                    data={categoriesData}
                    zIndex={1000}
                  ></MultiSelect>
                  <FormHelperText>The product categories.</FormHelperText>
                  <FormErrorMessage>
                    The product categories are required.
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="h-max rounded-md bg-white p-4 drop-shadow-md">
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>

                  <Input type="text" placeholder="t-shirt"></Input>
                  <FormHelperText>The product type.</FormHelperText>
                  <FormErrorMessage>
                    The product type is required.
                  </FormErrorMessage>
                </FormControl>
              </div>
            </div>

            <div className="col-span-4 flex w-full flex-col gap-4 rounded-md bg-white p-4 drop-shadow-md">
              <FormControl isRequired>
                <FormLabel>Media</FormLabel>
                <div>
                  <UploadProductMedia></UploadProductMedia>
                </div>
                <FormHelperText>The product title media.</FormHelperText>
                <FormErrorMessage>Product title is required.</FormErrorMessage>
              </FormControl>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default create;

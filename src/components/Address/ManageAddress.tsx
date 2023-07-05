import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Select } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { ADDRESS_TYPE } from "~/config/addressConfig";
import { COUNTRIES } from "~/config/commonConfig";
import { api } from "~/utils/api";
import Input from "../base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "~/validations/addressSchema";
import { DevTool } from "@hookform/devtools";
import { UserShippingAddress } from "@prisma/client";
import React from "react";

interface AddressFormValues {
  fullName: string;
  phoneCode: string;
  phoneNumber: string;
  type: "HOME" | "OFFICE";
  country: "BH" | "KW" | "OM" | "QA" | "SA" | "AE";
  streetName: string;
  buildingNumber: string;
  city: string;
  province: string;
  nearestLandmark: string;
}

function ManageAddress({
  Trigger,
  action = "create",
  address,
  onRefetch,
}: {
  Trigger: React.ReactNode;
  onRefetch: () => void;
  action?: "create" | "edit";
  address?: UserShippingAddress;
}) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    mode: "all",
    defaultValues: {
      fullName: address?.fullName ?? "",
      phoneCode: address?.phoneNumber?.code ?? "",
      phoneNumber: address?.phoneNumber?.number ?? "",
      type: address?.type ?? "HOME",
      country: address?.country ?? "BH",
      streetName: address?.streetName ?? "",
      buildingNumber: address?.buildingNumber ?? "",
      city: address?.city ?? "",
      province: address?.province ?? "",
      nearestLandmark: address?.nearestLandmark ?? "",
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      onRefetch();
      reset();
    },
  });

  const createAddress = api.user.address.create.useMutation({
    onSuccess(data, variables, context) {
      toast({
        title: "Address created",
        status: "success",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Address creation failed",
        description: error.message,
        status: "error",
      });
    },
  });

  const updateAddress = api.user.address.update.useMutation({
    onSuccess(data, variables, context) {
      toast({
        title: "Address updated",
        status: "success",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Failed to update address",
        description: error.message,
        status: "error",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log("eheheheh");
    if (action === "create") {
      createAddress.mutate({
        country: data.country,
        buildingNumber: data.buildingNumber,
        city: data.city,
        province: data.province,
        nearestLandmark: data.nearestLandmark,
        streetName: data.streetName,
        fullName: data.fullName,
        phoneNumber: { code: data.phoneCode, number: data.phoneNumber },
        type: data.type,
      });
    } else if (action === "edit") {
      if (address) {
        updateAddress.mutate({
          id: address.id,
          country: data.country,
          buildingNumber: data.buildingNumber,
          city: data.city,
          province: data.province,
          nearestLandmark: data.nearestLandmark,
          streetName: data.streetName,
          fullName: data.fullName,
          phoneNumber: { code: data.phoneCode, number: data.phoneNumber },
          type: data.type,
        });
      }
    }
  });

  return (
    <>
      <div onClick={onOpen}>{Trigger}</div>
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DevTool control={control}></DevTool>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {action === "create" ? "Add New Address" : "Edit Address"}
          </DrawerHeader>

          <DrawerBody>
            <form
              id="my-form"
              onSubmit={(...args) => void onSubmit(...args)}
              noValidate
            >
              <VStack>
                <FormControl isInvalid={!!errors.country} isRequired>
                  <FormLabel>Country/region</FormLabel>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(value) =>
                          field.onChange(value as AddressFormValues["country"])
                        }
                        error={!!errors.country}
                        data={COUNTRIES.map((c) => ({
                          value: c.code,
                          label: c.name,
                        }))}
                        placeholder="e.g. Saudi Arabia"
                      ></Select>
                    )}
                  ></Controller>

                  <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.fullName} isRequired>
                  <FormLabel>Full name (First and Last name)</FormLabel>
                  <Input
                    placeholder="e.g. Mohamed Ahmed Esham"
                    {...register("fullName")}
                  ></Input>
                  <FormErrorMessage>
                    {errors.fullName?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!(errors.phoneNumber || errors.phoneCode)}
                  isRequired
                >
                  <FormLabel>Mobile number</FormLabel>

                  <HStack>
                    <Controller
                      control={control}
                      name="phoneCode"
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(value) => field.onChange(value || "")}
                          data={COUNTRIES.map((c) => ({
                            value: c.mobileCode,
                            label: `${c.code} ${c.mobileCode}`,
                          }))}
                          placeholder="e.g. +966"
                          error={!!errors.phoneCode}
                        ></Select>
                      )}
                    ></Controller>
                    <Input
                      isRequired
                      placeholder="e.g. 000 000 000"
                      {...register("phoneNumber")}
                    ></Input>
                  </HStack>

                  <FormHelperText>
                    Will be used to assist delivery
                  </FormHelperText>
                  <FormErrorMessage>
                    {errors.phoneCode?.message}
                  </FormErrorMessage>
                  <FormErrorMessage>
                    {errors.phoneNumber?.message}
                  </FormErrorMessage>
                </FormControl>

                <Divider></Divider>

                <FormControl isInvalid={!!errors.streetName} isRequired>
                  <FormLabel>Street name</FormLabel>
                  <Input
                    placeholder="e.g. Tahlia Street"
                    {...register("streetName")}
                  ></Input>

                  <FormErrorMessage>
                    {errors.streetName?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.buildingNumber} isRequired>
                  <FormLabel>Building name/no</FormLabel>
                  <Input
                    placeholder="e.g. Prince Tower"
                    {...register("buildingNumber")}
                  ></Input>
                  <FormErrorMessage>
                    {errors.buildingNumber?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.city} isRequired>
                  <FormLabel>City/Area</FormLabel>
                  <Input
                    placeholder="e.g. Riyadh"
                    {...register("city")}
                  ></Input>

                  <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.province} isRequired>
                  <FormLabel>District</FormLabel>
                  <Input
                    placeholder="e.g. Riyadh"
                    {...register("province")}
                  ></Input>
                  <FormErrorMessage>
                    {errors.province?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.nearestLandmark}>
                  <FormLabel>Nearest landmark</FormLabel>
                  <Input
                    placeholder="e.g. Prince Tower"
                    {...register("nearestLandmark")}
                  ></Input>
                  <FormErrorMessage>
                    {errors.nearestLandmark?.message}
                  </FormErrorMessage>
                </FormControl>

                <Divider></Divider>

                <FormControl isInvalid={!!errors.type} isRequired>
                  <FormLabel>Address type</FormLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(value) =>
                          field.onChange(value as AddressFormValues["type"])
                        }
                        defaultValue={ADDRESS_TYPE[0]}
                        data={ADDRESS_TYPE.map((c) => ({
                          value: c,
                          label: c
                            .toLocaleLowerCase()
                            .replace(/./, (s) => s.toLocaleUpperCase()),
                        }))}
                        error={!!errors.type}
                      ></Select>
                    )}
                  ></Controller>

                  <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button type="submit" form="my-form">
              {action === "create" ? "Add Address" : "Edit Address"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ManageAddress;

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
//import { discountSchema } from "~/validations/discountSchema";
import { api } from "~/utils/api";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Discount } from "@prisma/client";
import { NumberInput } from "@mantine/core";
import { generateRandomString } from "~/utils/discountCode";
import { discountSchema } from "~/validations/discountSchema";
import { DevTool } from "@hookform/devtools";

type DiscountFormValues = {
  code: string;
  amount: number;
  expiresAt: Date;
};

function ManageDiscount({
  onRefetch,
  action,
  discount,
}: {
  onRefetch: () => void;
  action: "create" | "edit";
  discount?: Discount;
}) {
  const toast = useToast({});
  const createDiscountHook = api.discount.create.useMutation();
  const editDiscountHook = api.discount.edit.useMutation();
  const [isPrecentage, setIsPrecentage] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    getValues,
  } = useForm<DiscountFormValues>({
    mode: "onChange",
    resolver: zodResolver(discountSchema),
    defaultValues: {
      ...discount,
      amount: (discount?.fixedAmount || discount?.precentage) as
        | number
        | undefined,

      expiresAt: new Date(discount?.expiresAt || ""),
    },
  });

  useEffect(() => {
    setIsPrecentage(!!discount?.precentage);
  }, [discount]);

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (action === "edit") {
        if (discount)
          await editDiscountHook.mutateAsync({
            id: discount.id,
            code: data.code,
            expiresAt: new Date(data.expiresAt),
            precentage: isPrecentage ? data.amount : undefined,
            fixedAmount: isPrecentage ? undefined : data.amount,
          });
      } else {
        await createDiscountHook.mutateAsync({
          code: data.code,
          expiresAt: new Date(data.expiresAt),
          precentage: isPrecentage ? data.amount : undefined,
          fixedAmount: isPrecentage ? undefined : data.amount,
        });
      }

      toast({
        status: "success",
        title: `${action === "create" ? "Created" : "Edited"} ${
          data.code
        } successfully`,
      });

      onClose();
      onRefetch();
    } catch (error) {
      toast({
        status: "error",
        title: `Failed to ${action === "create" ? "create" : "edit"} ${
          data.code
        }`,
        description: (error as any as Error)?.message,
      });
    }

    return "";
  });

  return (
    <div>
      <DevTool control={control} />
      {action === "create" ? (
        <Button onClick={onOpen}>Add discount</Button>
      ) : (
        <IconButton
          onClick={onOpen}
          icon={<PencilIcon className="h-5 w-5"></PencilIcon>}
          aria-label="edit discount"
        ></IconButton>
      )}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action === "create" ? "Create new discount" : "Edit discount"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              noValidate
              id="discount-form"
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <FormControl isRequired isInvalid={!!errors.code}>
                <FormLabel>Discount Code</FormLabel>
                <HStack>
                  <Input
                    type="text"
                    {...register("code")}
                    placeholder="SA23"
                  ></Input>
                  <Button
                    onClick={() => setValue("code", generateRandomString(6))}
                  >
                    Generate
                  </Button>
                </HStack>
                <FormHelperText>The discount code.</FormHelperText>
                <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.amount}>
                <FormLabel>Discount</FormLabel>

                <VStack>
                  <ButtonGroup isAttached width={"full"}>
                    <Button
                      width={"full"}
                      colorScheme={isPrecentage ? undefined : "gray"}
                      onClick={() => setIsPrecentage(true)}
                    >
                      Precentage
                    </Button>
                    <Button
                      colorScheme={isPrecentage ? "gray" : undefined}
                      width={"full"}
                      onClick={() => setIsPrecentage(false)}
                    >
                      Fixed Amount
                    </Button>
                  </ButtonGroup>
                  <InputGroup>
                    <InputLeftAddon children={isPrecentage ? "%" : "SAR"} />
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          min={0}
                          max={isPrecentage ? 100 : undefined}
                          className="w-full"
                          error={!!errors.amount}
                        ></NumberInput>
                      )}
                    ></Controller>
                  </InputGroup>
                </VStack>

                <FormHelperText>The Discount amount.</FormHelperText>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.expiresAt} isRequired>
                <FormLabel>Discount Expire Date</FormLabel>
                <Input
                  type="date"
                  min={0}
                  {...register("expiresAt", { valueAsDate: true })}
                  value={
                    dateIsValid(getValues("expiresAt"))
                      ? getValues("expiresAt")?.toISOString().split("T")[0]
                      : undefined
                  }
                />

                {/* <div className="flex w-full flex-col items-center">  <Controller
                    control={control}
                    name="expiersAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        ref={field.ref}
                        onChange={(date) =>
                          field.onChange(new Date(date as Date))
                        }
                        onBlur={field.onBlur}
                        //locale="ar-sa"
                      ></DatePicker>
                    )}
                  ></Controller>   </div>*/}

                <FormHelperText>
                  The date when the discount will expire.
                </FormHelperText>
                <FormErrorMessage>{errors.expiresAt?.message}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                isLoading={isSubmitting}
                loadingText="Saving"
                type="submit"
                form="discount-form"
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

function dateIsValid(date: Date) {
  return !Number.isNaN(new Date(date).getTime());
}

export default ManageDiscount;

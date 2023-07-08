/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  HStack,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
  FormHelperText,
  PinInput,
  PinInputField,
  useSteps,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Box,
  VStack,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

interface EditEmailFormValues {
  email: string;
  code: string;
}

const steps = [
  { title: "First", description: "Verify your email" },
  { title: "Second", description: "Verify your new email" },
  { title: "Third", description: "Complete" },
] as const;

function EditEmail({ onRefetch }: { onRefetch: () => void }) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure({});
  const sendEmailVerification =
    api.user.sendEmailChangeVerification.useMutation();
  const updateUserEmail = api.user.updateUserEmail.useMutation();
  const t = useTranslations("EditEmail");

  const { activeStep, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditEmailFormValues>({
    mode: "onChange",
    defaultValues: { email: "" },
    resetOptions: {
      keepDirtyValues: true,
    },
    resolver: zodResolver(
      z.object({ email: z.string().email(), code: z.string().min(4).max(4) })
    ),
  });

  function handleSendEmailVerification() {
    sendEmailVerification.mutate(undefined, {
      onError(error) {
        toast({
          title: t("email-verification.error"),
          description: error.message,
          status: "error",
        });
      },
      onSuccess() {
        toast({
          title: t("email-verification.success"),
          status: "success",
        });
        goToNext();
        onRefetch();
      },
    });
  }

  const onSubmit = handleSubmit((data) => {
    updateUserEmail.mutate(
      { code: data.code, newEmail: data.email },
      {
        onError(error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
          });
        },
        onSuccess() {
          toast({
            title: "Success",
            status: "success",
          });
          goToNext();
        },
      }
    );
  });

  return (
    <>
      <Button onClick={onOpen}>Edit</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                void onSubmit(e);
              }}
              id="edit-email"
            >
              <VStack spacing={8}>
                <Stepper
                  index={activeStep}
                  size={"sm"}
                  w={"full"}
                  flexWrap={"wrap"}
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                <Tabs index={activeStep}>
                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={4}>
                        <Heading size="md">
                          We’ll need to verify your old email address
                        </Heading>

                        <Button
                          onClick={() => handleSendEmailVerification()}
                          w="full"
                        >
                          Send Verification code
                        </Button>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.code}>
                          <FormLabel>Verification code</FormLabel>
                          <VStack alignItems={"start"}>
                            <Controller
                              control={control}
                              name="code"
                              render={({ field }) => (
                                <HStack>
                                  <PinInput otp type="alphanumeric" {...field}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                  </PinInput>
                                </HStack>
                              )}
                            ></Controller>

                            <Button
                              onClick={() => handleSendEmailVerification()}
                              variant={"link"}
                              size="sm"
                            >
                              Didn’t receive a code or it expired? Resend it.
                            </Button>
                          </VStack>
                          <FormHelperText>
                            Check your email: we sent you a verification code.
                            Enter it here to verify you’re really you.
                          </FormHelperText>
                          <FormErrorMessage>
                            {errors.code?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel>New Email</FormLabel>
                          <VStack alignItems={"start"}>
                            <Input
                              placeholder="yournewemail@mail.com"
                              {...register("email")}
                            ></Input>
                          </VStack>
                          <FormHelperText>
                            Your new email address. We’ll send you a
                            verification
                          </FormHelperText>
                        </FormControl>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4}>
                        <Heading size="md">
                          Your email address has been changed!
                        </Heading>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} variant={"ghost"}>
              Close
            </Button>

            {activeStep === 1 && (
              <Button type="submit" form="edit-email">
                Submit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditEmail;

/* eslint-disable @typescript-eslint/unbound-method */
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useDisclosure,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";

interface EditEmailFormValues {
  email: string;
  code: string;
}

const steps = [
  { title: "first", description: "Verify your email" },
  { title: "second", description: "Add your new email" },
  { title: "third", description: "Complete" },
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
      },
    });
  }

  const onSubmit = handleSubmit((data) => {
    updateUserEmail.mutate(
      { code: data.code, newEmail: data.email },
      {
        onError(error) {
          toast({
            title: t("email-edit.error"),
            description: error.message,
            status: "error",
          });
        },
        onSuccess() {
          toast({
            title: t("email-edit.success"),
            status: "success",
          });
          onRefetch();
          goToNext();
        },
      }
    );
  });

  return (
    <>
      <Button onClick={onOpen}>{t("edit")}</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
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
                        <StepTitle>
                          {t(`steps.${step.title}.meta.title`)}
                        </StepTitle>
                        <StepDescription>
                          {t(`steps.${step.title}.meta.description`)}
                        </StepDescription>
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                <Tabs index={activeStep}>
                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={4}>
                        <Heading size="md">{t("steps.first.header")}</Heading>

                        <Button
                          onClick={() => handleSendEmailVerification()}
                          w="full"
                        >
                          {t("steps.first.button")}
                        </Button>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.code}>
                          <FormLabel>
                            {t("steps.second.verification-code-input-label")}
                          </FormLabel>
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
                              {t("steps.second.verification-code-input-resend")}
                            </Button>
                          </VStack>
                          <FormHelperText>
                            {t("steps.second.verification-code-input-helper")}
                          </FormHelperText>
                          <FormErrorMessage>
                            {errors.code?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel>
                            {t("steps.second.new-email-input-label")}
                          </FormLabel>
                          <VStack alignItems={"start"}>
                            <Input
                              placeholder="yournewemail@mail.com"
                              {...register("email")}
                            ></Input>
                          </VStack>
                          <FormHelperText>
                            {t("steps.second.new-email-input-helper")}
                          </FormHelperText>
                        </FormControl>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4}>
                        <Heading size="md">{t("steps.third.header")}</Heading>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} variant={"ghost"}>
              {t("cancel")}
            </Button>

            {activeStep === 1 && (
              <Button type="submit" form="edit-email">
                {t("submit")}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditEmail;

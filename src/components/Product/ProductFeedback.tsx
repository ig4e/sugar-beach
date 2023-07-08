import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { LoadingOverlay, Rating } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import Feedback from "../feedback/Feedback";
dayjs.extend(relativeTime);

export interface ProductFeedbackFormValues {
  content: string;
  score: number;
}

function ProductFeedback({ productId }: { productId: string }) {
  const toast = useToast();
  const session = useSession();
  const productFeedbacksQuery =
    api.feedback.getProductFeedbacks.useInfiniteQuery({
      productId,
      limit: 50,
    });

  const userProductFeedbackQuery = api.feedback.getUserProductFeeback.useQuery({
    productId,
  });
  const postProductFeedback = api.feedback.postProductFeedback.useMutation();
  const editProductFeedback = api.feedback.editProductFeedback.useMutation();
  const deleteProductFeedback =
    api.feedback.deleteProductFeedback.useMutation();
  const t = useTranslations("ProductFeedback");

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors, isSubmitting, isDirty, touchedFields },
    setValue,
  } = useForm<ProductFeedbackFormValues>({
    mode: "all",
    async defaultValues() {
      const { data } = await userProductFeedbackQuery.refetch();
      return {
        content: data?.content ?? "",
        score: data?.score ?? 0,
      };
    },
  });

  function onSubmit(data: ProductFeedbackFormValues) {
    if (session.status === "authenticated") {
      toast({
        title: t("submitting-feedback"),
        status: "info",
      });

      if (userProductFeedbackQuery.data) {
        editProductFeedback.mutate(
          {
            id: userProductFeedbackQuery.data.id,
            content: data.content,
            score: data.score,
          },
          {
            onSuccess(data) {
              reset({ content: data.content, score: data.score });
              toast({
                title: t("success.feedback-edit"),
                status: "success",
              });
              void productFeedbacksQuery.refetch();
            },
            onError(error) {
              toast({
                title: t("errors.feedback-edit"),
                description: error.message,
                status: "error",
              });
            },
          }
        );
      } else {
        postProductFeedback.mutate(
          {
            productId,
            content: data.content,
            score: data.score,
          },
          {
            onSuccess(data) {
              reset();
              toast({
                title: t("success.feedback-add"),
                status: "success",
              });

              setValue("content", data.content);
              setValue("score", data.score);

              void productFeedbacksQuery.refetch();
              void userProductFeedbackQuery.refetch();
            },
            onError(error) {
              toast({
                title: t("errors.feedback-add"),
                description: error.message,
                status: "error",
              });
            },
          }
        );
      }
    }
  }

  function handleUserFeedbackDelete() {
    if (userProductFeedbackQuery.data) {
      deleteProductFeedback.mutate(
        { id: userProductFeedbackQuery.data.id },
        {
          onError(error) {
            toast({
              title: t("errors.feedback-delete"),
              description: error.message,
              status: "error",
            });
          },
          onSuccess() {
            toast({
              title: t("success.feedback-delete"),
              status: "success",
            });
            reset({ content: "", score: 1 });
            void productFeedbacksQuery.refetch();
            void userProductFeedbackQuery.refetch();
          },
        }
      );
    }
  }

  return (
    <div>
      <DevTool control={control}></DevTool>

      <Card>
        <CardHeader>
          <Heading size="md">{t("customer-feedback")}</Heading>
        </CardHeader>

        <Divider></Divider>

        <CardBody>
          <VStack alignItems={"start"}>
            <form
              className="relative flex w-full flex-col gap-4"
              onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
              noValidate
            >
              <LoadingOverlay visible={isSubmitting} overlayBlur={2} />
              <FormControl w={"full"} isInvalid={!!errors.content}>
                <FormLabel fontWeight={"semibold"}>
                  {userProductFeedbackQuery.data
                    ? t("edit-your-feedback")
                    : t("add-your-feedback")}
                </FormLabel>
                <HStack spacing={4}>
                  <Avatar
                    src={session.data?.user.image as string | undefined}
                    name={session.data?.user.name}
                    size={"md"}
                  ></Avatar>

                  <VStack w={"full"} alignItems={"start"}>
                    <Textarea
                      {...register("content", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                        min: {
                          value: 10,
                          message: "Min length is 10 letters",
                        },
                        max: {
                          value: 1000,
                          message: "Max length is 1000 letters",
                        },
                      })}
                      minH={"12"}
                      width={"full"}
                      placeholder={t("feedback-input.placeholder")}
                      focusBorderColor="pink.500"
                    ></Textarea>
                    <Controller
                      control={control}
                      name="score"
                      rules={{
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                        min: { value: 1, message: "Min score is 1" },
                        max: { value: 5, message: "Max score is 1" },
                      }}
                      render={({ field }) => (
                        <Rating
                          value={field.value}
                          onChange={field.onChange}
                          name={field.name}
                          onBlur={field.onBlur}
                          size="lg"
                          color="pink"
                        ></Rating>
                      )}
                    ></Controller>
                  </VStack>
                </HStack>
                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
              </FormControl>
              <HStack alignSelf={"end"}>
                {(isDirty || touchedFields.content || touchedFields.score) && (
                  <Button
                    size="sm"
                    maxW={"fit-content"}
                    variant={"outline"}
                    onClick={() =>
                      userProductFeedbackQuery.data
                        ? reset()
                        : reset({ content: "", score: 1 })
                    }
                    isDisabled={postProductFeedback.isLoading || isSubmitting}
                  >
                    {t("discard")}
                  </Button>
                )}

                {userProductFeedbackQuery.data && (
                  <Button
                    type="button"
                    size="sm"
                    maxW={"fit-content"}
                    onClick={handleUserFeedbackDelete}
                    isLoading={deleteProductFeedback.isLoading}
                    loadingText="Deleting"
                    variant={"outline"}
                    colorScheme="red"
                  >
                    {t("delete")}
                  </Button>
                )}

                <Button
                  type="submit"
                  size="sm"
                  maxW={"fit-content"}
                  isLoading={postProductFeedback.isLoading || isSubmitting}
                  loadingText="Submitting"
                >
                  {t("submit")}
                </Button>
              </HStack>
            </form>
          </VStack>
        </CardBody>

        <Divider></Divider>

        <CardFooter position={"relative"}>
          <LoadingOverlay
            visible={productFeedbacksQuery.isLoading}
            overlayBlur={2}
          ></LoadingOverlay>

          <VStack alignItems={"start"} spacing={4}>
            {productFeedbacksQuery.data &&
              productFeedbacksQuery.data.pages.map((page) => {
                return (
                  <Fragment key={page.nextCursor}>
                    {page.items.map((feedback) => {
                      return (
                        <Feedback
                          feedback={feedback}
                          key={feedback.id}
                        ></Feedback>
                      );
                    })}
                  </Fragment>
                );
              })}
          </VStack>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProductFeedback;

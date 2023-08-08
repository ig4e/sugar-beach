import {
  HStack,
  Text,
  VStack,
  Heading,
  IconButton,
  Badge,
  Card,
  CardBody,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Grid } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import { SkeletonContext, SkeletonWrap } from "~/components/base/SkeletonWrap";
import AdminLayout from "~/components/layout/AdminLayout";
import OrderProductsTable from "~/components/orders/OrderProductsTable";
import useCurrency from "~/hooks/useCurrency";
import useDayjs from "~/hooks/useDayjs";
import { api } from "~/utils/api";

function OrderPage() {
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const { data, isLoading } = api.order.getOrder.useQuery({ id: orderId });
  const dayjs = useDayjs();
  const { t: cT } = useTranslation("common");
  const currency = useCurrency();

  return (
    <SkeletonContext.Provider value={isLoading}>
      <AuthGaurd allowedLevel="STAFF">
        <AdminLayout>
          <div className="space-y-4">
            <HStack w="full" spacing={4} alignItems={"start"}>
              <Link href={"/dashboard/orders"}>
                <IconButton
                  variant={"outline"}
                  icon={<ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>}
                  aria-label="back"
                  colorScheme="pink"
                />
              </Link>
              <VStack alignItems={"start"}>
                <SkeletonWrap>
                  <HStack>
                    <Heading size={"md"}>#{data?.number}</Heading>
                    <Badge>
                      {cT("paymentStatus." + (data?.invoice?.status ?? ""))}
                    </Badge>
                  </HStack>

                  <Text fontSize={"sm"} suppressHydrationWarning>
                    {dayjs(data?.createdAt).format("MMMM D, YYYY")} at{" "}
                    {dayjs(data?.createdAt).format("h:mm a")}
                  </Text>
                </SkeletonWrap>
              </VStack>
            </HStack>

            <div className="space-y-4 md:grid md:grid-cols-8 md:gap-4">
              <div className="space-y-4 md:col-span-6">
                <OrderProductsTable orderId={orderId}></OrderProductsTable>
                <Card>
                  <CardBody>
                    <FormControl>
                      <FormLabel>Customer invoice</FormLabel>
                    </FormControl>
                    <VStack alignItems={"start"}>
                      <FormControl>
                        <FormLabel fontSize={"sm"}>ID</FormLabel>
                        <SkeletonWrap>
                          <p className="text-sm">{data?.invoice?.invoiceId}</p>
                        </SkeletonWrap>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize={"sm"}>Total</FormLabel>
                        <SkeletonWrap>
                          <p className="text-sm">
                            {currency(data?.totalPrice ?? 0).format()}
                          </p>
                        </SkeletonWrap>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </div>
              <div className="!mt-0 space-y-4 md:col-span-2">
                <Card>
                  <CardBody>
                    <FormControl>
                      <FormLabel>Customer notes</FormLabel>
                      <SkeletonWrap>
                        <Text>
                          {data?.additionalNotes || "No notes from customer"}
                        </Text>
                      </SkeletonWrap>
                    </FormControl>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <VStack alignItems={"start"}>
                      <FormControl>
                        <FormLabel>Customer</FormLabel>
                        <SkeletonWrap>
                          <p className="text-sm">{data?.user.name}</p>
                        </SkeletonWrap>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Contact information</FormLabel>

                        <SkeletonWrap>
                          <p className="text-sm">{data?.user.email}</p>
                          <p className="text-sm">
                            {data?.shippingAddress.phoneNumber.code}-
                            {data?.shippingAddress.phoneNumber.number}
                          </p>
                        </SkeletonWrap>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Shipping address</FormLabel>

                        <SkeletonWrap>
                          <p className="text-sm">
                            {data?.shippingAddress.fullName}
                          </p>
                          <p className="text-sm">
                            {data?.shippingAddress.buildingNumber} -{" "}
                            {data?.shippingAddress.streetName}
                          </p>

                          <p className="text-sm">
                            {data?.shippingAddress.nearestLandmark}
                          </p>

                          <p className="text-sm">
                            {data?.shippingAddress.province}
                          </p>

                          <p className="text-sm">
                            {data?.shippingAddress.city}
                          </p>

                          <p className="text-sm">
                            {data?.shippingAddress.country}
                          </p>
                        </SkeletonWrap>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </AdminLayout>
      </AuthGaurd>
    </SkeletonContext.Provider>
  );
}

export default OrderPage;

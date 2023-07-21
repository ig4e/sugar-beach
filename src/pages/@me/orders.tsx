import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";
import { type RouterInputs, api } from "~/utils/api";
import { LoadingOverlay, Pagination } from "@mantine/core";
import useCurrency from "~/hooks/useCurrency";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { Locale } from "~/types/locale";
import { useRouter } from "next/router";
import { OrderStatus } from "@prisma/client";
import { ORDER_STATUS } from "~/config/ordersConfig";

function Orders() {
  const { t, lang } = useTranslation("accountOrders");
  const router = useRouter();
  const locale = lang as Locale;
  const [pageState, setPageState] = useState<
    RouterInputs["order"]["getUserOrders"]
  >({ cursor: 1, status: "ALL" });

  const { data: ordersPage, isLoading } =
    api.order.getUserOrders.useQuery(pageState);

  const currency = useCurrency();

  return (
    <UserDashboardLayout>
      <div className="w-full space-y-4">
        <Heading size="md">{t("my-orders")}</Heading>
        <Tabs variant={"solid-rounded"}>
          <TabList>
            <div className="flex  items-center gap-2 overflow-x-scroll pb-2 md:pb-0">
              <Tab
                key={"ALL"}
                onClick={() => setPageState({ status: "ALL" })}
                borderRadius={"lg"}
              >
                {t("orderStatus.ALL")}
              </Tab>
              {ORDER_STATUS.map((status) => (
                <Tab
                  key={status}
                  onClick={() => setPageState({ status })}
                  borderRadius={"lg"}
                  whiteSpace={"nowrap"}
                >
                  {t(`orderStatus.${status}`)}
                </Tab>
              ))}
            </div>
          </TabList>
        </Tabs>

        <div className="relative flex h-full min-h-[15rem] flex-col gap-4">
          <LoadingOverlay visible={isLoading}></LoadingOverlay>
          {ordersPage &&
            ordersPage.items.map((order) => {
              const invoiceColorScheme =
                order.invoice.status === "PAID"
                  ? "green"
                  : order.invoice.status === "CANCELLED"
                  ? "red"
                  : "gray";

              const processing: OrderStatus[] = ["ORDER_PLACED", "PROCESSING"];
              const cancelled: OrderStatus[] = ["CANCELLED", "REFUNDED"];
              const shipping: OrderStatus[] = ["PREPARING_TO_SHIP", "SHIPPED"];
              const delivered: OrderStatus[] = ["DELIVERED"];

              const orderStatusColorScheme = processing.includes(order.status)
                ? "gray"
                : cancelled.includes(order.status)
                ? "red"
                : shipping.includes(order.status)
                ? "yellow"
                : delivered.includes(order.status)
                ? "green"
                : "gray";

              return (
                <div key={order.id} id={order.id}>
                  <Card>
                    <CardHeader>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"start"}
                      >
                        <HStack>
                          <VStack alignItems={"start"}>
                            <p className="text-sm">
                              <span className="font-semibold">{t("invoice-id")}</span>{" "}
                              {order.invoice.invoiceId}
                            </p>
                            <span className="text-sm">
                              {dayjs(order.createdAt).format(
                                "D MMM YYYY HH:MM:ss"
                              )}
                            </span>
                          </VStack>
                        </HStack>

                        <VStack>
                          <span className="text-sm font-bold">
                            {currency(order.totalPrice).format()}
                          </span>
                          <Badge colorScheme={invoiceColorScheme}>
                            {order.invoice.status}
                          </Badge>
                        </VStack>
                      </HStack>
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                      <VStack alignItems={"start"} spacing={4}>
                        <p className="space-x-2 text-sm">
                          <span className="font-semibold">{t("order-status")}</span>
                          <Badge colorScheme={orderStatusColorScheme}>
                            {t(`orderStatus.${order.status}`)}
                          </Badge>
                        </p>

                        <VStack alignItems={"start"}>
                          {order.products.map(
                            ({ product, quantity, price }) => {
                              const productImage = product.media[0];
                              return (
                                <HStack
                                  justifyContent={"space-between"}
                                  key={product.id}
                                >
                                  <HStack alignItems={"start"}>
                                    <div className="rounded-md border-2">
                                      <Image
                                        src={productImage?.url || ""}
                                        alt={product.name[locale]}
                                        width={100}
                                        height={100}
                                        className="aspect-square h-16 w-16 rounded-md object-contain "
                                      ></Image>
                                    </div>
                                    <VStack spacing={1} alignItems={"start"}>
                                      <Link href={`/products/${product.id}`}>
                                        <Heading size="sm">
                                          {product.name[locale]}
                                        </Heading>
                                      </Link>
                                      <HStack>
                                        <Heading size="sm" color="pink.500">
                                          {currency(price)
                                            .multiply(quantity)
                                            .format()}
                                        </Heading>
                                        <Badge>x{quantity}</Badge>
                                      </HStack>
                                    </VStack>
                                  </HStack>
                                </HStack>
                              );
                            }
                          )}
                        </VStack>
                      </VStack>
                    </CardBody>
                    <Divider></Divider>
                    <CardFooter>
                      <HStack justifyContent={"space-between"} w={"full"}>
                        <p className="text-xs">
                          <span className="font-semibold">{t("order-id")}</span>{" "}
                          {order.id}
                        </p>

                        <p className="text-xs">
                          <span className="font-semibold">{t("shipping-to")}</span>{" "}
                          {order.shippingAddress.fullName}
                        </p>
                      </HStack>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
        </div>

        <HStack justifyContent={"center"}>
          <Pagination
            total={ordersPage?.totalPages ?? 1}
            onChange={(page) =>
              setPageState((state) => ({ ...state, cursor: page }))
            }
          />
        </HStack>
      </div>
    </UserDashboardLayout>
  );
}

export default Orders;

import {
  Badge,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/20/solid";
import { LoadingOverlay, Pagination } from "@mantine/core";
import { OrderStatus } from "@prisma/client";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";
import {
  INVOICE_STATUS_COLOR,
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
} from "~/config/ordersConfig";
import useCurrency from "~/hooks/useCurrency";
import useDayjs from "~/hooks/useDayjs";
import { Locale } from "~/types/locale";
import { api, type RouterInputs } from "~/utils/api";

function Orders() {
  const { t, lang } = useTranslation("accountOrders");
  const router = useRouter();
  const locale = lang as Locale;
  const [pageState, setPageState] = useState<
    RouterInputs["order"]["getUserOrders"]
  >({ cursor: 1, status: "ALL", invoiceStatus: "ALL" });

  const { data: ordersPage, isLoading } =
    api.order.getUserOrders.useQuery(pageState);

  const currency = useCurrency();
  const dayjs = useDayjs();

  return (
    <UserDashboardLayout>
      <div className="w-full space-y-4">
        <Heading size="md">{t("my-orders")}</Heading>
        <Tabs variant={"solid-rounded"}>
          <TabList>
            <div className="flex  items-center gap-2 overflow-x-scroll pb-2 md:pb-0">
              <Tab
                key={"ALL"}
                onClick={() =>
                  setPageState((state) => ({
                    ...state,
                    status: "ALL",
                    cursor: 1,
                  }))
                }
                borderRadius={"lg"}
              >
                {t("orderStatus.ALL")}
              </Tab>
              {ORDER_STATUS.map((status) => (
                <Tab
                  key={status}
                  onClick={() =>
                    setPageState((state) => ({
                      ...state,
                      cursor: 1,
                      status: status,
                    }))
                  }
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
                INVOICE_STATUS_COLOR[order.invoice.status];

              const orderStatusColorScheme = ORDER_STATUS_COLOR[order.status];

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
                              <span className="font-semibold">
                                {t("invoice-id")}
                              </span>{" "}
                              {order.invoice.invoiceId}
                            </p>
                            <span className="text-sm">
                              {dayjs(order.createdAt).format(
                                "D MMM YYYY HH:MM:ss"
                              )}
                            </span>
                          </VStack>
                        </HStack>

                        <HStack spacing={4}>
                          <VStack>
                            <span className="text-sm font-bold">
                              {currency(order.totalPrice).format()}
                            </span>
                            <Badge colorScheme={invoiceColorScheme}>
                              {order.invoice.status}
                            </Badge>
                          </VStack>
                          {order.invoice.status === "PENDING" && (
                            <Link href={order.invoice.url}>
                              <Button size="sm">Pay</Button>
                            </Link>
                          )}
                        </HStack>
                      </HStack>
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                      <VStack alignItems={"start"} spacing={4}>
                        <p className="space-x-2 text-sm">
                          <span className="font-semibold">
                            {t("order-status")}
                          </span>
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
                        <VStack alignItems={"start"}>
                          <p className="text-xs">
                            <span className="font-semibold">
                              {t("order-id")}
                            </span>{" "}
                            #{order.number}
                          </p>

                          <p className="text-xs">
                            <span className="font-semibold">
                              {t("shipping-to")}
                            </span>{" "}
                            {order.shippingAddress.fullName}
                          </p>
                        </VStack>

                        <Button
                          leftIcon={
                            <ArchiveBoxXMarkIcon className="h-4 w-4"></ArchiveBoxXMarkIcon>
                          }
                          size={"sm"}
                          colorScheme="red"
                        >
                          Cancel order
                        </Button>
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

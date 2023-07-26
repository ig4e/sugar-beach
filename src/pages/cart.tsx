import {
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { type Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import AddToCart from "~/components/base/AddToCart";
import { paymentOptionLogos } from "~/components/base/Footer";
import Layout from "~/components/layout/Layout";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import type { Locale } from "~/types/locale";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";
import ManageAddress from "~/components/address/ManageAddress";
import currencyJs from "currency.js";

function Cart() {
  const { t, lang } = useTranslation("cart");
  const cartStore = useCartStore();
  const toast = useToast();
  const currency = useCurrency();
  const currencyIgnore = useCurrency(true);

  const userAddresses = api.user.address.findMany.useQuery({});
  const locale = lang as Locale;

  const { data, isLoading } = api.product.getCart.useQuery({
    productIDs: cartStore.items.reduce(
      (total, currentItem) => [...total, currentItem.id],
      [] as string[]
    ),
  });

  const dataWithCartQuantity = useMemo(() => {
    return data
      ?.map((product) => {
        const cartItem = cartStore.items.find((item) => item.id === product.id);

        if (!cartItem) return undefined;

        return {
          product,
          quantity: cartItem.quantity,
        };
      })
      .filter((product) => product !== undefined) as
      | {
          product: Product;
          quantity: number;
        }[]
      | undefined;
  }, [data, cartStore.items]);

  useEffect(() => {
    if (dataWithCartQuantity) {
      for (const { product, quantity } of dataWithCartQuantity) {
        if (product.quantity < quantity) {
          cartStore.removeItem(product.id, quantity - product.quantity);
          toast({
            title: "Not enough product quantity in stock",
            status: "error",
          });
        }
      }
    }
  }, [dataWithCartQuantity, cartStore, toast]);

  const totalPrice = useMemo(() => {
    if (!dataWithCartQuantity) return currency(0);

    const totalProductsPrice = dataWithCartQuantity.map(
      ({ product, quantity }) => {
        return currencyIgnore(product.price).multiply(quantity);
      }
    );

    const totalPrice = totalProductsPrice.reduce(
      (total, current) => currencyIgnore(total).add(current),
      currencyIgnore(0)
    );

    return currency(totalPrice ?? 0);
  }, [dataWithCartQuantity, currency, currencyIgnore]);

  const isCartEmpty = (dataWithCartQuantity?.length ?? 0) <= 0;

  return (
    <Layout>
      {dataWithCartQuantity && !isLoading && userAddresses.data ? (
        <>
          <div className="relative my-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <HStack justifyContent={"space-between"}>
                <Heading size="md">{t("your-order")}</Heading>
                <Text>
                  {dataWithCartQuantity.length} {t("items-count")}
                </Text>
              </HStack>
              <div className="flex h-full flex-col gap-4">
                <VStack
                  h={"full"}
                  justifyContent={"center"}
                  justifyItems={"center"}
                  hidden={!isCartEmpty}
                  mt={8}
                  mb={16}
                  spacing={4}
                >
                  <Heading className="line-clamp-1">
                    {t("cart-empty.heading")}
                  </Heading>
                  <Text>{t("cart-empty.text")}</Text>

                  <Link href={"/"}>
                    <Button>{t("cart-empty.button")}</Button>
                  </Link>
                </VStack>

                {dataWithCartQuantity.map(({ product, quantity }) => {
                  const productImage = product.media[0];
                  return (
                    <HStack justifyContent={"space-between"} key={product.id}>
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
                            <Heading size="sm">{product.name[locale]}</Heading>
                          </Link>
                          <Heading size="sm" color="pink.500">
                            {currency(product.price)
                              .multiply(quantity)
                              .format()}
                          </Heading>
                          {product.compareAtPrice && (
                            <Text size="sm" textDecorationLine={"line-through"}>
                              {currency(product.compareAtPrice)
                                .multiply(quantity)
                                .format()}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      <div className="w-fit">
                        <AddToCart productId={product.id} />
                      </div>
                    </HStack>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <Heading size="md">{t("order-summary")}</Heading>
              <Card>
                <CardBody>
                  <HStack justifyContent={"space-between"}>
                    <Heading size="md" color="pink.500" fontWeight={"semibold"}>
                      {totalPrice.format()}
                    </Heading>

                    {userAddresses.data.length > 0 ? (
                      <Link href={"/checkout"}>
                        <Button isDisabled={isCartEmpty}>
                          {t("check-out")}
                        </Button>
                      </Link>
                    ) : (
                      <ManageAddress
                        Trigger={
                          <Button isDisabled={isCartEmpty}>
                            {t("add-address")}
                          </Button>
                        }
                        action="create"
                        onRefetch={() => void userAddresses.refetch()}
                      ></ManageAddress>
                    )}
                  </HStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VStack alignItems={"start"} spacing={4}>
                    <Heading size="md" fontWeight={"semibold"}>
                      {t("available-payment-methods")}
                    </Heading>

                    <HStack flexWrap={"wrap"}>
                      {paymentOptionLogos.map((logo, index) => (
                        <Image
                          width={128}
                          height={64}
                          quality={100}
                          src={logo}
                          alt="Payment method"
                          key={"payment-logo" + String(index)}
                          className="h-8 w-16 object-cover"
                        />
                      ))}
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <LoadingOverlay visible overlayBlur={2}></LoadingOverlay>
      )}
    </Layout>
  );
}

export default Cart;

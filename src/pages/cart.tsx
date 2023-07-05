import {
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { LoadingOverlay } from "@mantine/core";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import AddToCart from "~/components/base/AddToCart";
import { paymentOptionLogos } from "~/components/base/Footer";
import MainLayout from "~/components/layout/MainLayout";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";

function Cart() {
  const cartStore = useCartStore();
  const toast = useToast();

  const { data, isLoading, isError } = api.product.getCart.useQuery({
    productIDs: cartStore.items.reduce(
      (total, currentItem) => [...total, currentItem.id],
      [] as string[]
    ),
  });

  const userAddresses = api.user.address.findMany.useQuery({});

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

  const currency = useCurrency();

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
  }, [dataWithCartQuantity]);

  const totalPrice = useMemo(() => {
    const total = dataWithCartQuantity
      ?.map(({ product, quantity }) => {
        return currency(product.price).multiply(quantity).value;
      })
      .reduce((total, current) => currency(total).add(current).value, 0);
    return currency(total ?? 0);
  }, [dataWithCartQuantity, currency]);

  if (!isLoading && !data) {
    return <div>Err... Loading...</div>;
  }

  const isCartEmpty = (dataWithCartQuantity?.length ?? 0) <= 0;

  return (
    <MainLayout>
      {dataWithCartQuantity && !isLoading && userAddresses.data ? (
        <>
          <div className="relative my-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <HStack justifyContent={"space-between"}>
                <Heading size="md">Your order</Heading>
                <Text>{dataWithCartQuantity.length} Items</Text>
              </HStack>
              <div className="flex h-full flex-col gap-4">
                <VStack
                  h={"full"}
                  justifyContent={"center"}
                  justifyItems={"center"}
                  hidden={!isCartEmpty}
                >
                  <Heading>Looking for something?</Heading>
                  <Text>Add your favourite items to your cart.</Text>

                  <Link href={"/"}>
                    <Button>Keep Shopping</Button>
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
                            alt={product.name.en}
                            width={100}
                            height={100}
                            className="aspect-square h-16 w-16 rounded-md object-contain "
                          ></Image>
                        </div>
                        <VStack spacing={1} alignItems={"start"}>
                          <Link href={`/products/${product.id}`}>
                            <Heading size="sm">{product.name.en}</Heading>
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
              <Heading size="md">Order Summary</Heading>
              <Card>
                <CardBody>
                  <HStack justifyContent={"space-between"}>
                    <Heading size="md" color="pink.500" fontWeight={"semibold"}>
                      {totalPrice.format()}
                    </Heading>

                    <Button isDisabled={isCartEmpty}>Check out</Button>
                  </HStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VStack alignItems={"start"} spacing={4}>
                    <Heading size="md" fontWeight={"semibold"}>
                      Available payment methods
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
    </MainLayout>
  );
}

export default Cart;

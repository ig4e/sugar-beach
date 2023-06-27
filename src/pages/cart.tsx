import { HStack, Heading, IconButton, Text, VStack } from "@chakra-ui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Product } from "@prisma/client";
import Image from "next/image";
import React, { useMemo } from "react";
import MainLayout from "~/components/layout/MainLayout";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";

function Cart() {
  const cartStore = useCartStore();

  const { data, isLoading, isError } = api.product.getCart.useQuery({
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

  const currency = useCurrency();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dataWithCartQuantity) {
    return <div>Err... Loading...</div>;
  }

  if (!data) {
    return <div>Err... Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="my-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <HStack justifyContent={"space-between"}>
            <Heading size="md">Your order</Heading>
            <Text>{dataWithCartQuantity.length} Items</Text>
          </HStack>
          <div className="flex flex-col gap-4">
            {dataWithCartQuantity.map(({ product, quantity }) => {
              const productImage = product.media[0];

              return (
                <HStack justifyContent={"space-between"}>
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
                      <Heading size="sm">{product.name.en}</Heading>
                      <Heading size="sm" color="pink.500">
                        {currency(product.price).multiply(quantity).format()}
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

                  <HStack>
                    <IconButton
                      icon={<MinusIcon className="h-5 w-5" />}
                      aria-label="subtract quantity"
                      size="sm"
                      variant={"outline"}
                      onClick={() => cartStore.removeItem(product.id)}
                    ></IconButton>

                    <Heading size="sm" minW={"12"} textAlign={"center"}>
                      {quantity}
                    </Heading>

                    <IconButton
                      icon={<PlusIcon className="h-5 w-5" />}
                      aria-label="add quantity"
                      size="sm"
                      variant={"solid"}
                      onClick={() => cartStore.addItem(product.id)}
                    ></IconButton>
                  </HStack>
                </HStack>
              );
            })}
          </div>
        </div>
        <div>
          <Heading size="md">Order Summary</Heading>
        </div>
      </div>
    </MainLayout>
  );
}

export default Cart;

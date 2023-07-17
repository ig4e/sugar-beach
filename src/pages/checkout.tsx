import {
  Card,
  Button,
  CardBody,
  HStack,
  Heading,
  Link,
  VStack,
  useToast,
  Text,
  Divider,
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { Product } from "@prisma/client";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import AddressCard from "~/components/address/AddressCard";
import { paymentOptionLogos } from "~/components/base/Footer";
import Layout from "~/components/layout/Layout";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import { Locale } from "~/types/locale";
import { api } from "~/utils/api";

function Checkout() {
  const cartStore = useCartStore();
  const toast = useToast();
  const currency = useCurrency();
  const userAddresses = api.user.address.findMany.useQuery({});
  const { t, lang } = useTranslation("checkout");
  const locale = lang as Locale;

  const createOrder = api.order.create.useMutation({
    onSuccess(data, variables, context) {
      //cartStore.clear();
      toast({
        title: t("order-placed"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log(data);
    },

    onError(error, variables, context) {
      toast({
        title: t("order-failed"),
        status: "error",
        description: error.message,
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const [selectedAddress, setSelectedAddress] = useState<string>();

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

  const totalPrice = useMemo(() => {
    const total = dataWithCartQuantity
      ?.map(({ product, quantity }) => {
        return currency(product.price).multiply(quantity).value;
      })
      .reduce((total, current) => currency(total).add(current).value, 0);
    return currency(total ?? 0);
  }, [dataWithCartQuantity, currency]);

  return (
    <Layout>
      {dataWithCartQuantity && !isLoading && userAddresses.data ? (
        <>
          <div className="relative my-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <HStack justifyContent={"space-between"}>
                <Heading size="md">{t("order-summary")}</Heading>
                <Text>
                  {dataWithCartQuantity.length} {t("items-count")}
                </Text>
              </HStack>
              <div className="flex flex-col gap-4">
                {dataWithCartQuantity.map(({ product, quantity }) => {
                  const productImage = product.media[0];
                  return (
                    <HStack justifyContent={"space-between"} key={product.id}>
                      <HStack alignItems={"start"}>
                        <div className="rounded-md border">
                          <Image
                            src={productImage?.url || ""}
                            alt={product.name[locale]}
                            width={24}
                            height={24}
                            className="aspect-square h-6 w-6 rounded-md object-contain "
                          ></Image>
                        </div>
                        <HStack alignItems={"center"}>
                          <Link href={`/products/${product.id}`}>
                            <Heading size="sm">{product.name[locale]}</Heading>
                          </Link>
                          {product.compareAtPrice && (
                            <Text size="sm" textDecorationLine={"line-through"}>
                              {currency(product.compareAtPrice)
                                .multiply(quantity)
                                .format()}
                            </Text>
                          )}
                          <Heading size="sm" color="pink.500">
                            {currency(product.price)
                              .multiply(quantity)
                              .format()}
                          </Heading>
                        </HStack>
                      </HStack>
                    </HStack>
                  );
                })}
              </div>
              <Divider></Divider>
              <Heading size="md">{t("your-addresses")}</Heading>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {userAddresses.data.map((address) => (
                  <Button
                    key={address.id}
                    colorScheme={
                      address.id === selectedAddress ? undefined : "gray"
                    }
                    variant={"unstyled"}
                    height="fit-content"
                    onClick={() => setSelectedAddress(address.id)}
                    className="transition-transform hover:scale-[0.99] active:scale-[0.98]"
                  >
                    <AddressCard
                      address={address}
                      active={address.id === selectedAddress}
                    ></AddressCard>
                  </Button>
                ))}
              </div>
            </div>
            <div className="sticky bottom-2 md:space-y-4">
              <Heading size="md" opacity={{ base: 0, md: 1 }}>
                {t("order-summary")}
              </Heading>
              <Card>
                <CardBody>
                  <HStack justifyContent={"space-between"}>
                    <Heading size="md" color="pink.500" fontWeight={"semibold"}>
                      {totalPrice.format()}
                    </Heading>
                    <Button
                      isDisabled={!selectedAddress}
                      onClick={() =>
                        selectedAddress &&
                        createOrder.mutate({
                          products: cartStore.items,
                          shippingAddressId: selectedAddress,
                        })
                      }
                    >
                      Pay
                    </Button>
                  </HStack>
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

export default Checkout;

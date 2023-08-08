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
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { Product } from "@prisma/client";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useRef, useState } from "react";
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
  const currencyIgnore = useCurrency(true);
  const currency = useCurrency();
  const userAddresses = api.user.address.findMany.useQuery({});
  const { t, lang } = useTranslation("checkout");
  const locale = lang as Locale;
  const router = useRouter();

  const createOrder = api.order.create.useMutation({
    onSuccess(data, variables, context) {
      //cartStore.clear();

      if (data) {
        toast({
          title: t("order-placed"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        void router.push(data.invoice.url);
      }

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

  const [orderState, setOrderState] = useState<{
    addressId: string;
    additionalNotes: string;
  }>({ additionalNotes: "", addressId: "" });

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

  function handleOrder(paymentGateway: "myfatoorah" | "tabby" | "tamara") {
    if (!orderState.addressId) return;

    if (paymentGateway === "myfatoorah") {
      createOrder.mutate({
        products: cartStore.items,
        shippingAddressId: orderState.addressId,
        additionalNotes: orderState.additionalNotes,
      });
    }
  }

  const PayCard = () => (
    <>
      <Heading size="md" display={{ base: "none", md: "block" }}>
        {t("order-summary")}
      </Heading>
      <Card>
        <CardBody>
          <Stack
            justifyContent={"space-between"}
            direction={["column", "row"]}
            spacing={4}
          >
            <Heading size="lg" color="pink.500" fontWeight={"semibold"}>
              {totalPrice.format()}
            </Heading>

            <HStack>
              <Button
                variant={"outline"}
                colorScheme="orange"
                onClick={() => handleOrder("tamara")}
              >
                <svg
                  className="h-8 w-16"
                  viewBox="0 0 185 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M90.5893 5.77756C88.359 4.92403 86.1287 4.53009 83.4392 5.121C81.2745 5.58059 79.5689 6.43413 78.4538 8.6008C78.9786 8.99473 79.3722 9.38867 79.8313 9.78261C80.5529 10.4392 81.2745 11.0301 82.2584 11.818C83.0456 10.7018 84.4231 9.45433 85.9319 9.38867C87.6374 9.32302 89.2773 10.3079 89.5397 11.6867C89.6709 12.2776 89.7365 14.6412 89.7365 14.6412L88.8181 14.8382C88.7525 14.8382 88.5558 14.9038 88.2934 14.8382C88.2278 14.8382 88.2278 14.7725 88.1622 14.7725C88.0966 14.7725 88.0966 14.7725 88.031 14.7069C85.9975 13.9846 84.0952 13.5907 82.2584 13.5907C81.6025 13.5907 80.9465 13.6564 80.2905 13.722C78.257 14.0503 75.8955 15.1665 75.8955 18.8432C75.8955 20.222 76.2235 21.2725 76.8139 22.126C77.929 23.6362 79.5034 24.5553 81.6025 24.5553C83.8984 24.5553 85.9319 23.9644 87.8998 22.3887C87.9654 22.3887 88.359 21.9947 88.4902 21.9291L89.7365 20.9442V22.52V24.5553H94.9187V11.818C94.7875 8.99473 93.2132 6.76241 90.5893 5.77756ZM88.9493 17.5957C87.8342 19.5654 86.0631 20.6816 83.964 20.6816C83.8984 20.6816 83.7672 20.6816 83.7016 20.6816C83.308 20.6816 82.8488 20.6159 82.3896 20.5503C80.8153 20.1564 79.9625 18.9089 80.0281 17.2018L80.0937 16.4796H89.6053L88.9493 17.5957Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M144.51 5.77756C142.28 4.92403 140.05 4.53009 137.36 5.121C135.195 5.58059 133.49 6.43413 132.375 8.6008C132.899 8.99473 133.293 9.38867 133.752 9.78261C134.474 10.4392 135.195 11.0301 136.179 11.818C136.966 10.7018 138.344 9.45433 139.853 9.38867C141.558 9.32302 143.198 10.3079 143.461 11.6867C143.592 12.2776 143.657 14.6412 143.657 14.6412L142.739 14.8382C142.673 14.8382 142.477 14.9038 142.214 14.8382C142.149 14.8382 142.149 14.7725 142.083 14.7725C142.017 14.7725 142.017 14.7725 141.952 14.7069C139.918 13.9846 138.016 13.5907 136.179 13.5907C135.523 13.5907 134.867 13.6564 134.211 13.722C132.178 14.0503 129.816 15.1665 129.816 18.8432C129.816 20.222 130.144 21.2725 130.735 22.126C131.85 23.6362 133.424 24.5553 135.523 24.5553C137.819 24.5553 139.853 23.9644 141.821 22.3887C141.886 22.3887 142.28 21.9947 142.411 21.9291L143.657 20.9442V22.52V24.5553H148.84V11.818C148.708 8.99473 147.2 6.76241 144.51 5.77756ZM142.87 17.5957C141.755 19.5654 139.984 20.6816 137.885 20.6816C137.819 20.6816 137.688 20.6816 137.622 20.6816C137.229 20.6816 136.77 20.6159 136.311 20.5503C134.736 20.1564 133.883 18.9089 133.949 17.2018L134.015 16.4796H143.526L142.87 17.5957Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M179.801 5.77756C177.571 4.92403 175.341 4.53009 172.651 5.121C170.486 5.58059 168.781 6.43413 167.666 8.6008C168.19 8.99473 168.584 9.38867 169.043 9.78261C169.765 10.4392 170.486 11.0301 171.47 11.818C172.258 10.7018 173.635 9.45433 175.144 9.38867C176.849 9.32302 178.489 10.3079 178.752 11.6867C178.883 12.2776 178.948 14.6412 178.948 14.6412L178.03 14.8382C177.964 14.8382 177.768 14.9038 177.505 14.8382C177.44 14.8382 177.44 14.7725 177.374 14.7725C177.308 14.7725 177.309 14.7725 177.243 14.7069C175.209 13.9846 173.307 13.5907 171.47 13.5907C170.814 13.5907 170.158 13.6564 169.502 13.722C167.469 14.0503 165.107 15.1665 165.107 18.8432C165.107 20.222 165.435 21.2725 166.026 22.126C167.141 23.6362 168.715 24.5553 170.814 24.5553C173.11 24.5553 175.144 23.9644 177.112 22.3887C177.177 22.3887 177.571 21.9947 177.702 21.9291L178.948 20.9442V22.52V24.5553H184.131V11.818C183.999 8.99473 182.425 6.76241 179.801 5.77756ZM178.161 17.5957C177.046 19.5654 175.275 20.6816 173.176 20.6816C173.11 20.6816 172.979 20.6816 172.913 20.6816C172.52 20.6816 172.061 20.6159 171.602 20.5503C170.027 20.1564 169.174 18.9089 169.24 17.2018L169.306 16.4796H178.817L178.161 17.5957Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M162.878 6.43457C161.238 6.50023 159.991 7.22245 159.204 8.66689C159.139 8.79821 158.548 9.91437 158.548 9.91437L157.302 9.65174V9.06083V6.6972H152.316V24.4901H157.302V22.8487C157.302 21.2073 157.302 19.5002 157.302 17.8588V17.5305C157.302 16.9396 157.236 16.3487 157.302 15.6921C157.433 13.3942 159.204 11.6871 161.369 11.4245C162.09 11.3588 163.796 11.2932 163.993 11.2932V6.43457C163.665 6.43457 163.271 6.43457 162.878 6.43457Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M71.9595 20.3535C71.5659 20.3535 71.1067 20.3535 70.6475 20.2222C69.3356 20.0253 68.4828 19.3687 68.1548 18.3182C68.0236 17.8586 67.8924 17.399 67.8924 16.9394V8.99495H68.6796C70.3195 8.92929 72.0907 8.79798 73.7962 8.33838L72.7466 4.72727L67.958 5.4495V0H62.3167V5.31818H58.3809V8.99495H62.1855C62.1855 8.99495 62.1855 16.5455 62.1855 18.5152C62.1855 19.7626 62.5135 20.8788 63.1695 21.8636C63.9566 23.0455 65.0062 23.7677 66.6461 24.1616C68.4172 24.6212 70.1228 24.5556 72.0251 24.5556C72.1563 24.5556 72.3531 24.5556 72.4842 24.5556V20.3535C72.4186 20.3535 72.353 20.3535 72.2875 20.3535C72.2219 20.3535 72.0907 20.3535 71.9595 20.3535Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M115.32 14.4444C115.32 12.6716 116.501 11.2272 118.141 11.0959C120.109 10.8989 121.486 11.8838 121.88 13.7221C121.945 14.0504 121.945 14.3787 121.945 14.707C121.945 17.3989 121.945 20.0252 121.945 22.7171V24.4898H126.931V21.7322C126.931 18.6464 126.931 15.5605 126.931 12.4747C126.931 11.7525 126.865 11.2272 126.8 10.7676C126.406 8.53528 125.225 7.22215 123.192 6.63124C121.027 6.04033 117.419 6.49993 115.714 9.45447L114.926 10.9646C114.533 8.73225 113.221 7.15649 111.253 6.56558C109.088 5.97467 105.808 6.49993 104.169 9.38881L103.447 10.7019V6.6969H98.1992V24.4898H103.381C103.381 24.4898 103.381 17.3989 103.381 14.8383C103.381 14.51 103.381 14.1817 103.447 13.8535C103.644 12.5403 104.497 11.5555 105.743 11.2272C107.186 10.8333 108.629 11.2929 109.416 12.3434C110.007 13.1312 110.072 13.9848 110.072 14.6413C110.072 17.1363 110.072 24.4898 110.072 24.4898H115.32"
                    fill="#000000"
                  ></path>
                  <path
                    d="M2.3615 6.89418C1.31194 8.076 0.524777 9.32347 0 10.7023L16.5305 24.4245C17.3176 23.8992 18.1048 23.374 18.7608 22.6518L19.0888 22.3235C25.3861 15.7578 21.2535 8.66691 18.7608 6.30327C14.2346 1.90428 7.01889 2.0356 2.68948 6.5659L2.3615 6.89418Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M48.0176 14.5104C48.0176 20.8791 42.901 26.0003 36.5381 26.0003C30.1752 26.0003 25.0586 20.8791 25.0586 14.5104C25.0586 8.20738 30.1752 3.02051 36.5381 3.02051C42.901 3.08616 48.0176 8.20738 48.0176 14.5104Z"
                    fill="#000000"
                  ></path>
                </svg>
              </Button>
              <Button
                variant={"outline"}
                colorScheme="green"
                onClick={() => handleOrder("tabby")}
              >
                <svg
                  className="h-8 w-16"
                  viewBox="0 0 141 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M122.239 16.873L113.948 48.5272L113.929 48.5989H120.386L128.707 16.873H122.239Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M19.643 34.8883C18.6747 35.3651 17.6091 35.6112 16.5297 35.6072C14.2043 35.6072 12.8847 35.2358 12.7413 33.3563V33.2297C12.7413 33.1551 12.7328 33.089 12.7328 33.0018V27.528L12.7413 26.8837V23.0248H12.7328V21.3831L12.7413 20.7332V17.008L6.97342 17.7691C10.8744 17.0136 13.1126 13.9272 13.1126 10.8505V8.95557H6.63157V17.8183L6.26581 17.921V34.334C6.47964 38.9455 9.5183 41.6859 14.504 41.6859C16.2667 41.6859 18.2066 41.285 19.6922 40.6111L19.726 40.597V34.8391L19.643 34.8883Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M20.6657 15.6799L2.47736 18.4837V23.0951L20.6657 20.2914V15.6799Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M20.6657 22.427L2.47736 25.2307V29.6368L20.6657 26.8317V22.427Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M41.0782 24.5485C40.8208 19.425 37.6189 16.3892 32.4026 16.3892C29.4033 16.3892 26.9316 17.5469 25.2533 19.7401C23.575 21.9333 22.6971 25.1394 22.6971 29.0362C22.6971 32.933 23.5806 36.1489 25.2533 38.3336C26.9259 40.5184 29.4033 41.6846 32.4026 41.6846C37.6189 41.6846 40.8208 38.6333 41.0782 33.483V41.2021H47.5495V16.9294L41.0782 17.9282V24.5485ZM41.4159 29.0418C41.4159 33.5801 39.0328 36.5119 35.3456 36.5119C31.5472 36.5119 29.2753 33.7194 29.2753 29.0418C29.2711 24.3375 31.5402 21.5239 35.3414 21.5239C37.1899 21.5239 38.7345 22.2442 39.8079 23.606C40.856 24.9368 41.4116 26.8149 41.4116 29.0376L41.4159 29.0418Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M66.4581 16.3905C61.2389 16.3905 58.0356 19.4277 57.7824 24.5569V9.86157L51.3013 10.8618V41.2034H57.7824V33.4815C58.0356 38.6388 61.2389 41.693 66.4581 41.693C72.5649 41.693 76.2113 36.9647 76.2113 29.0445C76.2113 21.1243 72.5649 16.3905 66.4581 16.3905ZM63.5151 36.5075C59.8265 36.5075 57.4448 33.5758 57.4448 29.0375C57.4448 26.8148 57.999 24.9367 59.0485 23.6031C60.1219 22.2413 61.6665 21.521 63.5151 21.521C67.3134 21.521 69.5854 24.3346 69.5854 29.0375C69.5854 33.7151 67.3162 36.5075 63.5151 36.5075Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M93.8595 16.3905C88.6403 16.3905 85.4385 19.4277 85.1838 24.5569V9.86157L78.7028 10.8618V41.2034H85.1838V33.4815C85.4385 38.6388 88.6403 41.693 93.8595 41.693C99.9663 41.693 103.613 36.9647 103.613 29.0445C103.613 21.1243 99.9663 16.3905 93.8595 16.3905ZM90.9165 36.5075C87.2293 36.5075 84.8462 33.5758 84.8462 29.0375C84.8462 26.8148 85.4005 24.9367 86.4499 23.6031C87.5233 22.2413 89.068 21.521 90.9165 21.521C94.7148 21.521 96.9868 24.3346 96.9868 29.0375C96.9868 33.7151 94.7176 36.5075 90.9165 36.5075Z"
                    fill="#292929"
                  ></path>
                  <path
                    d="M103.628 16.873H110.548L116.17 41.1584H109.966L103.628 16.873Z"
                    fill="#292929"
                  ></path>
                </svg>
              </Button>
              <Button
                isDisabled={!orderState.addressId}
                onClick={() => handleOrder("myfatoorah")}
              >
                Pay
              </Button>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </>
  );

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
                      address.id === orderState.addressId ? undefined : "gray"
                    }
                    variant={"unstyled"}
                    height="fit-content"
                    onClick={() =>
                      setOrderState((state) => ({
                        ...state,
                        addressId: address.id,
                      }))
                    }
                    className="transition-transform hover:scale-[0.99] active:scale-[0.98]"
                  >
                    <AddressCard
                      address={address}
                      active={address.id === orderState.addressId}
                    ></AddressCard>
                  </Button>
                ))}
              </div>
            </div>
          
            <div className=" space-y-4">
              <div className="hidden space-y-4 md:block">
                <PayCard></PayCard>
              </div>

              <Heading size="md">{t("order-notes")}</Heading>
              <Card>
                <CardBody>
                  <FormControl>
                    <FormLabel>{t("order-notes-label")}</FormLabel>
                    <Textarea
                      onChange={(e) =>
                        setOrderState((state) => ({
                          ...state,
                          additionalNotes: e.target.value,
                        }))
                      }
                    ></Textarea>
                    <FormHelperText>{t("order-notes-helper")}</FormHelperText>
                  </FormControl>
                </CardBody>
              </Card>
            </div>

            <div className="sticky bottom-2 md:hidden z-50">
              <PayCard></PayCard>
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

import {
  Badge,
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NumberInput, Spoiler } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { SEO } from "~/components/SEO";
import Layout from "~/components/layout/Layout";
import ProductFeedback from "~/components/product/ProductFeedback";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import type { Locale } from "~/types/locale";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";
import ProductRow from "~/components/product/ProductRow";

function ProductPage() {
  const router = useRouter();
  const productId = router.query.productId as string;
  const productQuery = api.product.get.useQuery({ id: productId });
  const relatedProductsQuery = api.product.similarProducts.useQuery({
    id: productId,
  });

  const productVisit = api.product.visit.useMutation();
  const { data, isLoading } = productQuery;
  const [quantity, setQuantity] = React.useState(1);
  const cartStore = useCartStore();

  const { t, lang } = useTranslation("product");
  const locale = lang as Locale;

  useEffect(() => {
    if (productId) {
      productVisit.mutate({ id: productId });
    }
  }, [productId]);

  const currency = useCurrency();

  const cartQuantity =
    cartStore.items.find((item) => item.id === data?.id)?.quantity ?? 0;

  useEffect(() => {
    if (data) {
      if (cartQuantity > data.quantity) {
        setQuantity(data.quantity);
        cartStore.removeItem(data.id, cartQuantity - data.quantity);
      }

      if (quantity > data.quantity) {
        setQuantity(data.quantity);
      }
    }
  }, [cartQuantity, quantity, cartStore, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Err... Loading...</div>;
  }

  const isOutOfStock = data.quantity <= 0;

  return (
    <Layout>
      <SEO
        title={data.name[locale]}
        description={data.description[locale] || "No description"}
        createdAt={data.createdAt}
        updatedAt={data.updatedAt}
        image={data.media[0]?.url}
        key={data.id}
        openGraphType="website"
        settings={{ meta: { title: data.name[locale] } }}
      ></SEO>
      <div className="relative my-8 space-y-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex h-fit flex-col-reverse gap-4 md:flex-row">
            <div className="flex min-w-fit items-center gap-2 md:flex-col">
              {data.media.slice(0, 6).map((media) => {
                return (
                  <Image
                    key={media.key}
                    src={media.url}
                    className="aspect-square h-12 w-12 rounded-md bg-white object-cover"
                    alt={data.name[locale]}
                    width={64}
                    height={64}
                  />
                );
              })}
              {data.media.length > 6 && (
                <div className=" flex h-12 w-12 items-center justify-center rounded-md bg-zinc-400 text-white">
                  <span className="text-lg">...</span>
                </div>
              )}
            </div>
            <Swiper
              key="productSlider"
              spaceBetween={12}
              className="h-full w-full overflow-hidden rounded-xl"
              slidesPerView={1}
              speed={500}
              direction="horizontal"
              pagination={{
                clickable: true,
                enabled: true,
                bulletActiveClass: "bullet-active-swiper",
              }}
              mousewheel={true}
              keyboard={true}
              a11y={{ enabled: true }}
              modules={[Navigation, Pagination, Mousewheel, A11y, Keyboard]}
            >
              {data.media.map((media) => {
                return (
                  <SwiperSlide key={media.key}>
                    <Image
                      quality={100}
                      src={media.url}
                      className="aspect-square h-full w-full rounded-xl bg-white object-cover"
                      alt={data.name[locale]}
                      width={480}
                      height={480}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="flex flex-col gap-4">
            <VStack alignItems={"start"}>
              <Heading>{data.name[locale]}</Heading>
              <HStack flexWrap={"wrap"}>
                {!isOutOfStock && (
                  <Badge colorScheme="green">
                    {t("in-stock")} ({data.quantity} {t("left")})
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge colorScheme="red">{t("out-of-stock")}</Badge>
                )}
                {data.compareAtPrice && (
                  <Badge colorScheme="red">{t("sale")}</Badge>
                )}
                {data.categories.map((category) => (
                  <Badge key={category.id}>{category.name[locale]}</Badge>
                ))}
              </HStack>
            </VStack>
            <HStack alignItems={"start"}>
              <Text color="pink.600" fontSize="2xl" fontWeight={"semibold"}>
                {currency(data.price).format()}
              </Text>
              {data.compareAtPrice && (
                <Text
                  fontWeight={"semibold"}
                  alignSelf={"end"}
                  color={"red.500"}
                  textDecorationLine={"line-through"}
                >
                  {currency(data.compareAtPrice).format()}
                </Text>
              )}
            </HStack>

            <VStack alignItems={"start"}>
              <Heading size={"sm"}>{t("description")}</Heading>
              <Spoiler maxHeight={104} showLabel="Show more" hideLabel="Hide">
                <Text>{data.description[locale] ?? t("no-description")}</Text>
              </Spoiler>
            </VStack>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardBody
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={4}
              >
                <FormControl>
                  <FormLabel fontWeight={"semibold"}>{t("quantity")}</FormLabel>
                  <NumberInput
                    defaultValue={1}
                    placeholder="Quantity"
                    w={"100%"}
                    min={1}
                    max={data.quantity}
                    disabled={isOutOfStock}
                    value={quantity}
                    onChange={(value) => setQuantity(Number(value))}
                  ></NumberInput>
                  <FormHelperText>
                    {t("purchase-limit")}
                    {data.quantity}
                  </FormHelperText>
                </FormControl>
              </CardBody>
            </Card>

            <Card>
              <CardBody
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={4}
              >
                <HStack justifyContent={"space-between"}>
                  <Heading size={"lg"}> {t("total")}</Heading>
                  <Text color="pink.600" fontSize="2xl" fontWeight={"semibold"}>
                    {currency(data.price).multiply(quantity).format()}
                  </Text>
                </HStack>

                <Divider></Divider>
                <VStack>
                  <Button
                    w={"full"}
                    variant={"outline"}
                    disabled={isOutOfStock}
                    isDisabled={isOutOfStock}
                    onClick={() => cartStore.addItem(data.id, quantity)}
                  >
                    {t("add-to-cart")}
                  </Button>
                  <Button
                    w={"full"}
                    disabled={isOutOfStock}
                    isDisabled={isOutOfStock}
                    onClick={() => {
                      cartStore.addItem(data.id, quantity);
                      void router.push("/cart");
                    }}
                  >
                    {t("buy-now")}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ProductRow
            products={relatedProductsQuery?.data ?? []}
            title={t("related-products")}
            description={t("related-products-description")}
            
          ></ProductRow>
        </div>
        <div>
          <ProductFeedback productId={productId}></ProductFeedback>
        </div>
      </div>
    </Layout>
  );
}

export default ProductPage;

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
import MainLayout from "~/components/Layout/Layout";
import ProductFeedback from "~/components/Product/ProductFeedback";
import useCurrency from "~/hooks/useCurrency";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";

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
  }, [cartQuantity, quantity, data?.quantity, data?.id, cartStore]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Err... Loading...</div>;
  }

  const isOutOfStock = data.quantity <= 0;

  return (
    <MainLayout>
      <div className="relative my-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex h-fit flex-col-reverse gap-4 md:flex-row">
            <div className="flex min-w-fit items-center gap-2 md:flex-col">
              {data.media.slice(0, 6).map((media) => {
                return (
                  <Image
                    key={media.key}
                    src={media.url}
                    className="aspect-square h-12 w-12 rounded-md bg-white object-cover"
                    alt={data.name.en}
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
                      alt={data.name.en}
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
              <Heading>{data.name.en}</Heading>
              <HStack flexWrap={"wrap"}>
                {!isOutOfStock && (
                  <Badge colorScheme="green">
                    In Stock ({data.quantity} left)
                  </Badge>
                )}
                {isOutOfStock && <Badge colorScheme="red">Out Of Stock</Badge>}
                {data.compareAtPrice && <Badge colorScheme="red">Sale</Badge>}
                {data.categories.map((category) => (
                  <Badge key={category.id}>{category.name.en}</Badge>
                ))}
              </HStack>
            </VStack>
            <HStack alignItems={"start"}>
              <Text color="pink.600" fontSize="2xl" fontWeight={"semibold"}>
                {data.price} <span className="text-sm">SAR</span>
              </Text>
              {data.compareAtPrice && (
                <Text
                  fontWeight={"semibold"}
                  alignSelf={"end"}
                  color={"red.500"}
                  textDecorationLine={"line-through"}
                >
                  {data.compareAtPrice} <span className="text-sm">SAR</span>
                </Text>
              )}
            </HStack>

            <VStack alignItems={"start"}>
              <Heading size={"sm"}>Description</Heading>
              <Spoiler maxHeight={104} showLabel="Show more" hideLabel="Hide">
                <Text>{data.description.en || "No description"}</Text>
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
                  <FormLabel fontWeight={"semibold"}>Quantity</FormLabel>
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
                    Purchase limit: 0 ~ {data.quantity}
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
                  <Heading size={"lg"}>Total</Heading>
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
                    Add To Cart
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
                    Buy Now
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              gap={4}
            >
              {relatedProductsQuery.data
                ? relatedProductsQuery.data.map((product, index) => {
                    return <div>{product.name.en}</div>;
                  })
                : null}
            </CardBody>
          </Card>
        </div>
        <div>
          <ProductFeedback productId={productId}></ProductFeedback>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductPage;

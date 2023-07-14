import {
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Category, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCartStore } from "~/store/cart";
import AddToCart from "../base/AddToCart";
import type { Locale } from "~/types/locale";
import { LogoSmallTransparent } from "../logos";

import useTranslation from "next-translate/useTranslation";

function ProductCard({
  product,
  maxWidth,
}: {
  product: Product & { categories: Category[] };
  maxWidth?: "xs" | "sm" | "md" | "lg";
}) {
  const { t, lang } = useTranslation("common");
  const cartStore = useCartStore();
  const productImage = product.media[0]?.url || LogoSmallTransparent;
  const router = useRouter();
  const locale = lang as Locale;

  return (
    <Card height={"full"} maxW={maxWidth ? maxWidth : undefined}>
      <CardBody
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        gap={2}
        p={3}
      >
        <Link href={`/products/${product.id}`} className="flex flex-col gap-2">
          <VStack
            justifyItems={"start"}
            justifyContent={"start"}
            alignItems={"start"}
          >
            <div className="h-full max-h-40 w-full overflow-hidden rounded-md border">
              <Image
                src={productImage}
                width={256}
                height={128}
                alt={product.name[locale]}
                className="h-full max-h-40 w-full rounded-md object-cover"
              />
            </div>

            <Heading size="md" className="line-clamp-2">
              {product.name[locale]}
            </Heading>

            <HStack flexWrap={"wrap"}>
              {product.compareAtPrice && (
                <Badge colorScheme="red">{t("ProductCard.sale")}</Badge>
              )}
              {product.categories.slice(0, 4).map((category) => (
                <Badge key={category.id}>{category.name[locale]}</Badge>
              ))}
            </HStack>
          </VStack>
          <Text className="line-clamp-2">{product.description[locale]}</Text>
          <VStack alignItems={"start"} spacing={0}>
            {product.compareAtPrice && (
              <span className="text-xs text-red-500 line-through">
                {product.compareAtPrice} <span className="text-sm">SAR</span>
              </span>
            )}

            <Text color="pink.600" fontSize="xl" fontWeight={"semibold"}>
              {product.price} <span className="text-sm">SAR</span>
            </Text>
          </VStack>
        </Link>

        <VStack>
          <AddToCart productId={product.id} />

          <Button
            variant="solid"
            w={"full"}
            onClick={() => {
              cartStore.addItem(product.id);
              void router.push("/cart");
            }}
          >
            {t("ProductCard.buy-now")}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default ProductCard;

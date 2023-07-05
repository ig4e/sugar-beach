import {
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Text,
  VStack
} from "@chakra-ui/react";
import { Category, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/logo.png";
import { useCartStore } from "~/store/cart";
import AddToCart from "../base/AddToCart";

function ProductCard({
  product,
}: {
  product: Product & { categories: Category[] };
}) {
  const cartStore = useCartStore();
  const productImage = product.media[0]?.url || Logo;
  const router = useRouter();

  return (
    <Card>
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
            <Image
              src={productImage}
              width={256}
              height={256}
              alt={product.name.en}
              className="max-h-40 w-full rounded-md object-cover"
            />
            <Heading size="md">{product.name.en}</Heading>
            <HStack flexWrap={"wrap"}>
              {product.compareAtPrice && <Badge colorScheme="red">Sale</Badge>}
              {product.categories.map((category) => (
                <Badge key={category.id}>{category.name.en}</Badge>
              ))}
            </HStack>
          </VStack>
          <Text className="line-clamp-2">{product.description.en}</Text>
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
            Buy now
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default ProductCard;

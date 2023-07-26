import { MinusIcon } from "@chakra-ui/icons";
import { Button, HStack, Heading, IconButton } from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { LoadingOverlay } from "@mantine/core";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";
import { useStore } from "~/hooks/useStore";
import { useEffect } from "react";

function AddToCart({ productId }: { productId: string }) {
  const cartStore = useStore(useCartStore, (state) => state);
  const { t } = useTranslation("common");

  const { data: product } = api.product.get.useQuery({
    id: productId,
  });

  useEffect(() => {
    if (cartStore && product) {
      const cartItem = cartStore.items.find((item) => item.id === productId);

      if (cartItem) {
        if (cartItem.quantity > product.quantity)
          cartStore.removeItem(
            product.id,
            cartItem.quantity - product.quantity
          );
      }
    }
  }, [product, cartStore, productId]);

  if (!cartStore || !product)
    return (
      <div className="relative min-h-[2.5rem] min-w-[8rem]">
        <LoadingOverlay visible overlayBlur={2} />
      </div>
    );

  const cartItem = cartStore.items.find((item) => item.id === productId);

  return (
    <div className="w-full">
      {cartItem ? (
        <HStack justifyContent={"space-between"}>
          <IconButton
            icon={
              cartItem.quantity === 1 ? (
                <TrashIcon className="h-5 w-5" />
              ) : (
                <MinusIcon className="h-5 w-5" />
              )
            }
            aria-label="subtract quantity"
            size="md"
            variant={"outline"}
            onClick={() => cartStore.removeItem(product.id)}
            disabled={product.quantity <= 0}
          ></IconButton>

          <Heading
            size="md"
            minW={"12"}
            textAlign={"center"}
            color={product.quantity <= 0 ? "gray" : undefined}
          >
            {cartItem.quantity}
          </Heading>

          <IconButton
            icon={<PlusIcon className="h-5 w-5" />}
            aria-label="add quantity"
            size="md"
            variant={"solid"}
            onClick={() => cartStore.addItem(product.id)}
            isDisabled={
              product.quantity === 0 || product.quantity <= cartItem.quantity
            }
          ></IconButton>
        </HStack>
      ) : (
        <Button
          variant="outline"
          w={"full"}
          onClick={() => cartStore.addItem(productId)}
        >
          {t("ProductCard.add-to-cart")}
        </Button>
      )}
    </div>
  );
}

export default AddToCart;

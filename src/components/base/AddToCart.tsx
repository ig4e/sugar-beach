import { MinusIcon } from "@chakra-ui/icons";
import { Button, HStack, Heading, IconButton } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

import React, { useEffect } from "react";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";
import { LoadingOverlay } from "@mantine/core";

function AddToCart({ productId }: { productId: string }) {
  const cartStore = useCartStore();
  const cartItem = cartStore.items.find((item) => item.id === productId);
  const { data: product, isLoading } = api.product.get.useQuery({
    id: productId,
  });

  if (!product)
    return (
      <div className="relative min-h-[2.5rem] min-w-[8rem]">
        <LoadingOverlay visible overlayBlur={2} />
      </div>
    );

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
              product.quantity <= 0 || product.quantity === cartItem.quantity
            }
          ></IconButton>
        </HStack>
      ) : (
        <Button
          variant="outline"
          w={"full"}
          onClick={() => cartStore.addItem(productId)}
        >
          Add to cart
        </Button>
      )}
    </div>
  );
}

export default AddToCart;

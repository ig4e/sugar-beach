import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, HStack } from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { LoadingOverlay } from "@mantine/core";
import { useCartStore } from "~/store/cart";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { useStore } from "~/hooks/useStore";
import Input from "./Input";

function AddToCart({ productId }: { productId: string }) {
  const cartStore = useStore(useCartStore, (state) => state);
  const { t } = useTranslation("common");

  const { data: product } = api.product.get.useQuery({
    id: productId,
  });

  const cartItem = cartStore?.items.find((item) => item.id === productId);

  useEffect(() => {
    if (cartStore && product) {
      if (cartItem) {
        if (cartItem.quantity > product.quantity)
          cartStore.removeItem(
            product.id,
            cartItem.quantity - product.quantity
          );
      }
    }
  }, [product, cartStore, cartItem]);

  if (!cartStore || !product)
    return (
      <div className="relative max-h-6 min-h-[2rem] w-full min-w-[8rem] overflow-hidden rounded-lg border border-pink-500 bg-pink-200">
        <div className="flex w-full items-center overflow-hidden">
          <p className="h-10 w-5 bg-red-600"></p>
          <p className="h-10 w-5 bg-orange-600"></p>
          <p className="h-10 w-5 bg-amber-600"></p>
          <p className="h-10 w-5 bg-yellow-600"></p>
          <p className="h-10 w-5 bg-lime-600"></p>
          <p className="h-10 w-5 bg-green-600"></p>
          <p className="h-10 w-5 bg-emerald-600"></p>
          <p className="h-10 w-5 bg-teal-600"></p>
          <p className="h-10 w-5 bg-cyan-600"></p>
          <p className="h-10 w-5 bg-sky-600"></p>
          <p className="h-10 w-5 bg-blue-600"></p>
          <p className="h-10 w-5 bg-indigo-600"></p>
          <p className="h-10 w-5 bg-violet-600"></p>
          <p className="h-10 w-5 bg-fuchsia-600"></p>
          <p className="h-10 w-5 bg-pink-600"></p>
          <p className="h-10 w-5 bg-rose-600"></p>
        </div>
        <LoadingOverlay
          visible
          overlayBlur={5}
          loaderProps={{ size: "xs" }}
          sx={{ borderRadius: "7px" }}
        />
      </div>
    );

  return (
    <div className="w-full">
      {cartItem ? (
        <HStack justifyContent={"space-between"}>
          <Button
            aria-label="decrement quantity"
            size="sm"
            variant={"outline"}
            onClick={() => cartStore.removeItem(productId, 1)}
          >
            {cartItem.quantity === 1 ? (
              <TrashIcon className="h-5 min-h-max w-5 min-w-max" />
            ) : (
              <MinusIcon />
            )}
          </Button>

          <Input
            size="sm"
            minW={"12"}
            textAlign={"center"}
            color={product.quantity <= 0 ? "gray" : undefined}
            value={cartItem.quantity}
            w={"full"}
            max={product.quantity}
            min={0}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);

              if (value >= 0 && value <= product.quantity)
                cartStore.setItemQuantity(productId, value);
            }}
          ></Input>

          <Button
            aria-label="add quantity"
            size="sm"
            variant={"solid"}
            onClick={() => cartStore.addItem(productId, 1)}
            isDisabled={cartItem.quantity >= product.quantity}
          >
            <AddIcon />
          </Button>
        </HStack>
      ) : (
        <Button
          variant="outline"
          w={"full"}
          onClick={() => cartStore.addItem(productId, 1)}
          size={"sm"}
        >
          {t("ProductCard.add-to-cart")}
        </Button>
      )}
    </div>
  );
}

export default AddToCart;

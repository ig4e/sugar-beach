import { Button } from "@chakra-ui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Indicator } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { useStore } from "~/hooks/useStore";
import { useCartStore } from "~/store/cart";

function Cart() {
  const cartStore = useStore(useCartStore, (state) => state);
  const isCartFull = (cartStore?.items.length ?? 0) > 0;

  return (
    <Link href="/cart">
      <Indicator
        inline
        label={cartStore?.items.length}
        size={16}
        hidden={!isCartFull}
        processing={isCartFull}
      >
        <Button colorScheme="gray" variant="ghost" p={0} className="relative">
          <ShoppingCartIcon className="h-6 w-6"></ShoppingCartIcon>
        </Button>
      </Indicator>
    </Link>
  );
}

export default Cart;

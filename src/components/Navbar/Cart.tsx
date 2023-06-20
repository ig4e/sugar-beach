import { Button } from "@chakra-ui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useCartStore } from "~/store/cart";

function Cart() {
  const cartStore = useCartStore();

  return (
    <Button colorScheme="gray" variant="ghost" p={0} className="relative">
      {cartStore.items.length > 0 && (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 rounded-md bg-red-500 p-1 text-xs text-zinc-50">
          {cartStore.items.length}
        </div>
      )}

      <ShoppingCartIcon className="h-6 w-6 "></ShoppingCartIcon>
    </Button>
  );
}

export default Cart;

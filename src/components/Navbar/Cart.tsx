import { Button } from "@chakra-ui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import { useCartStore } from "~/store/cart";

function Cart() {
  const cartStore = useCartStore();

  return (
    <Link href="/cart">
      <Button colorScheme="gray" variant="ghost" p={0} className="relative">
        {cartStore.items.length > 0 && (
          <>
            <div className="absolute right-0 top-0 -mr-2.5 -mt-3.5 h-7 w-7 animate-ping rounded-full bg-red-400"></div>
            <div className="absolute right-0 top-0 -mr-2 -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[0.6rem] text-white">
              <span>{cartStore.items.length}</span>
            </div>
          </>
        )}

        <ShoppingCartIcon className="h-6 w-6"></ShoppingCartIcon>
      </Button>
    </Link>
  );
}

export default Cart;

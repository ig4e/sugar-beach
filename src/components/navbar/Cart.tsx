import { Button } from "@chakra-ui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Indicator } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "~/hooks/useStore";
import { useCartStore } from "~/store/cart";

function Cart() {
  const session = useSession();
  const cartStore = useStore(useCartStore, (state) => state);
  const isCartFull = (cartStore?.items.length ?? 0) > 0;

  return (
    <Link href="/cart" hidden={session.status !== "authenticated"}>
      <Indicator
        inline
        label={cartStore?.items.length}
        size={16}
        processing={isCartFull}
      >
        <Button
          colorScheme="gray"
          variant="ghost"
          p={0}
          className="relative"
          name="cart"
        >
          <ShoppingCartIcon className="h-6 w-6"></ShoppingCartIcon>
        </Button>
      </Indicator>
    </Link>
  );
}

export default Cart;

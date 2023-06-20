import { VStack } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import Image from "next/image";
import React from "react";

function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <div className="aspect-square rounded-md">
        {product.media[0] ? (
          <Image
            src={product.media[0]?.url}
            alt={product.name.en}
            width={256}
            height={256}
            className="rounded-md"
          ></Image>
        ) : (
          <svg
            viewBox="0 0 20 20"
            className="h-full w-full rounded-md"
            focusable="false"
            aria-hidden="true"
          >
            <path d="M2.5 1a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-15a1.5 1.5 0 0 0-1.5-1.5h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8.999 12.5h-13.002c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01l1.63 1.851 3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path>
          </svg>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper";
import type { Category, Product } from "@prisma/client";
import Link from "next/link";

function ProductRow({
  products,
  title,
  description,
  href,
}: {
  products: (Product & { categories: Category[] })[];
  title: string;
  description: string;
  href: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <VStack alignItems={"start"} spacing={0}>
          <h3 className="font-bold md:text-2xl">{title}</h3>
          <p className="text-xs font-medium text-muted-foreground md:text-base">
            {description}
          </p>
        </VStack>

        <Link href={href}>
          <Button borderRadius={"full"} size={{ base: "xs", md: "sm" }}>
            View more
          </Button>
        </Link>
      </div>
      <div className="relative">
        <Swiper
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          autoplay={true}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          speed={500}
          keyboard={true}
          a11y={{ enabled: true }}
          modules={[Navigation, Pagination, A11y, Keyboard, Autoplay]}
          className="!grid !h-full "
          navigation={{
            enabled: true,
            nextEl: "#slide-next-new",
            prevEl: "#slide-prev-new",
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-full">
              <ProductCard product={product}></ProductCard>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <button
          id="slide-prev-new"
          className="absolute inset-y-0 left-2 z-40 my-auto max-h-fit rounded-full bg-zinc-800 p-2 transition hover:bg-zinc-900 active:bg-zinc-800/50 disabled:opacity-50 disabled:hover:bg-zinc-700"
        >
          <ChevronLeftIcon className="h-5 w-5 text-white "></ChevronLeftIcon>
        </button>

        <button
          id="slide-next-new"
          className="absolute inset-y-0 right-2 z-40 my-auto max-h-fit rounded-full bg-zinc-800 p-2 transition hover:bg-zinc-900 active:bg-zinc-800/50 disabled:opacity-50 disabled:hover:bg-zinc-700"
        >
          <ChevronRightIcon className="h-5 w-5 text-white"></ChevronRightIcon>
        </button> */}
      </div>
    </section>
  );
}

export default ProductRow;

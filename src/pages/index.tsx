import { Heading, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import {
  A11y,
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Layout from "~/components/layout/Layout";
import ProductCard from "~/components/product/ProductCard";
import ProductRow from "~/components/product/ProductRow";
import { api } from "~/utils/api";

const HomePage: NextPage = () => {
  const { t } = useTranslation("home");
  const featuredProducts = api.featured.getAll.useQuery({});
  const newProducts = api.product.getAll.useQuery({
    orderBy: { key: "createdAt", type: "desc" },
  });
  const popularProducts = api.product.getAll.useQuery({
    orderBy: { key: "visits", type: "desc" },
  });
  const onSaleProducts = api.product.getAll.useQuery({
    onSale: true,
  });

  return (
    <Layout>
      <div className="relative my-8 space-y-8">
        <div>
          <Swiper
            spaceBetween={26}
            slidesPerView={1.4}
            breakpoints={{
              0: { slidesPerView: 1 },
              1024: { slidesPerView: 1.4 },
            }}
            autoplay={true}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            centeredSlides={true}
            className="aspect-square h-full max-h-[354] overflow-hidden rounded-xl md:aspect-auto md:max-h-96"
            speed={500}
            pagination={{
              clickable: true,
              enabled: true,
              bulletActiveClass: "bullet-active-swiper",
            }}
            navigation={{
              enabled: true,
              nextEl: "#slide-next",
              prevEl: "#slide-prev",
            }}
            mousewheel={true}
            keyboard={true}
            a11y={{ enabled: true }}
            modules={[
              Navigation,
              Pagination,
              Mousewheel,
              A11y,
              Keyboard,
              Autoplay,
            ]}
            loop={true}
          >
            {featuredProducts.data?.items.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <Link href={`/products/${item.productId}`}>
                    <Image
                      src={item.media[0]?.url || ""}
                      width={1040}
                      height={384}
                      quality={100}
                      alt="image"
                      className={clsx(
                        "aspect-[1040/364] h-full  w-full rounded-xl object-cover transition duration-1000 md:max-h-96",
                        {
                          "opacity-50": !isActive,
                        }
                      )}
                    ></Image>
                  </Link>
                )}
              </SwiperSlide>
            ))}

            <button
              id="slide-prev"
              className="absolute inset-y-0 left-2 z-40 my-auto max-h-fit rounded-full bg-zinc-800 p-2 transition hover:bg-zinc-900 active:bg-zinc-800/50 disabled:opacity-50 disabled:hover:bg-zinc-700"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white "></ChevronLeftIcon>
            </button>

            <button
              id="slide-next"
              className="absolute inset-y-0 right-2 z-40 my-auto max-h-fit rounded-full bg-zinc-800 p-2 transition hover:bg-zinc-900 active:bg-zinc-800/50 disabled:opacity-50 disabled:hover:bg-zinc-700"
            >
              <ChevronRightIcon className="h-5 w-5 text-white"></ChevronRightIcon>
            </button>

            <div id="swiper-pages"></div>
          </Swiper>
        </div>

        {onSaleProducts.data && (
          <ProductRow
            title={t("sections.on-sale.title")}
            description={t("sections.on-sale.description")}
            products={onSaleProducts.data?.items}
            href={
              "/search?query=&categories=&min=0&max=0&orderBy=visits&orderType=desc"
            }
          ></ProductRow>
        )}

        {popularProducts.data && (
          <ProductRow
            title={t("sections.popular.title")}
            description={t("sections.popular.description")}
            products={popularProducts.data?.items}
            href={
              "/search?query=&categories=&min=0&max=0&orderBy=visits&orderType=desc"
            }
          ></ProductRow>
        )}

        {newProducts.data && (
          <ProductRow
            title={t("sections.new.title")}
            description={t("sections.new.description")}
            products={newProducts.data?.items}
            href={
              "/search?query=&categories=&min=0&max=0&orderBy=createdAt&orderType=desc"
            }
          ></ProductRow>
        )}
      </div>
    </Layout>
  );
};

HomePage.displayName = "HomePage";

export default HomePage;

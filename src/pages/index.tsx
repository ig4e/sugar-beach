import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { SEO } from "~/components/SEO";
import Layout from "~/components/layout/Layout";
import { LogoLarge, LogoLargeDynamicPath } from "~/components/logos";
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
      <SEO
        title={"Sugar Beach | Best sweets"}
        openGraphType="website"
        image={LogoLargeDynamicPath}
      ></SEO>
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
            centeredSlides={true}
            className="aspect-square h-full overflow-hidden rounded-xl sm:aspect-auto sm:max-h-96"
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
            keyboard={true}
            a11y={{ enabled: true }}
            modules={[Navigation, Pagination, A11y, Keyboard, Autoplay]}
            loop={true}
          >
            {featuredProducts.data?.items.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <Link href={`/products/${item.productId}`}>
                    <Image
                      src={item.media[0]?.url ?? LogoLarge}
                      width={1024}
                      height={384}
                      quality={100}
                      alt="image"
                      loading="lazy"
                      className={clsx(
                        "hidden aspect-[1024/384] h-full w-full max-w-5xl rounded-xl bg-gray-400 object-cover transition duration-1000 sm:block md:max-h-96",
                        {
                          "opacity-50": !isActive,
                        }
                      )}
                    ></Image>

                    <Image
                      src={
                        item.media[1]?.url ?? item.media[0]?.url ?? LogoLarge
                      }
                      width={384}
                      height={384}
                      alt="image"
                      loading="lazy"
                      className={clsx(
                        "aspect-square h-full max-h-[32rem] w-full max-w-lg rounded-xl bg-gray-400 object-cover transition duration-1000 sm:hidden",
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

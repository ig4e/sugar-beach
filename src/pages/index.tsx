import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "~/components/layout/MainLayout";
import { api } from "~/utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import clsx from "clsx";
import { forwardRef } from "react";
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from "swiper";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const index: NextPage = () => {
  const featuredProducts = api.featured.getAll.useQuery({});

  return (
    <MainLayout>
      <div className="relative my-8">
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
          className="h-full max-h-80 overflow-hidden rounded-xl"
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
          modules={[Navigation, Pagination, Mousewheel, A11y, Keyboard]}
        >
          {featuredProducts.data?.items.map((item) => (
            <SwiperSlide>
              {({ isActive }) => (
                <Link href={`/products/${item.productId}`}>
                  <Image
                    src={item.media[0]?.url || ""}
                    width={1040}
                    height={364}
                    alt="image"
                    className={clsx(
                      "aspect-[1040/364] h-full max-h-80 w-full rounded-xl object-cover transition duration-1000",
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
    </MainLayout>
  );
};

const SliderSlide = forwardRef((props, ref) => {
  return (
    <SwiperSlide className="-z-50">
      {({ isActive }) => (
        <Image
          src={
            "https://cdn.discordapp.com/attachments/436232545139687424/1119821449859977297/gi20230615_w.webp"
          }
          width={1040}
          height={364}
          alt="image"
          className={clsx(
            "aspect-[1040/364] rounded-lg object-cover transition duration-1000",
            {
              "opacity-50": !isActive,
            }
          )}
        ></Image>
      )}
    </SwiperSlide>
  );
});

export default index;

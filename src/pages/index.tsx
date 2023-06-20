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
import { Mousewheel, Navigation, Pagination } from "swiper";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const index: NextPage = () => {
  return (
    <MainLayout>
      <div className="relative">
        <Swiper
          spaceBetween={26}
          slidesPerView={1.4}
          breakpoints={{
            1024: { slidesPerView: 1 },
            1025: { slidesPerView: 1.4 },
          }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          centeredSlides={true}
          className="h-full max-h-80"
          loop={true}
          speed={500}
          pagination={{ clickable: true }}
          navigation={{
            enabled: true,
            nextEl: "#slide-next",
            prevEl: "#slide-prev",
          }}
          modules={[Navigation, Pagination, Mousewheel]}
        >
          <SwiperSlide>
            {({ isActive }) => (
              <Image
                src={
                  "https://cdn.discordapp.com/attachments/436232545139687424/1119821449859977297/gi20230615_w.webp"
                }
                width={1040}
                height={364}
                alt="image"
                className={clsx(
                  "aspect-[1040/364] h-full max-h-80 rounded-lg object-cover transition duration-1000",
                  {
                    "opacity-50": !isActive,
                  }
                )}
              ></Image>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => (
              <Image
                src={
                  "https://cdn.discordapp.com/attachments/436232545139687424/1119821449859977297/gi20230615_w.webp"
                }
                width={1040}
                height={364}
                alt="image"
                className={clsx(
                  "aspect-[1040/364] h-full max-h-80 rounded-lg object-cover transition duration-1000",
                  {
                    "opacity-50": !isActive,
                  }
                )}
              ></Image>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => (
              <Image
                src={
                  "https://cdn.discordapp.com/attachments/436232545139687424/1119821449859977297/gi20230615_w.webp"
                }
                width={1040}
                height={364}
                alt="image"
                className={clsx(
                  "aspect-[1040/364] h-full max-h-80 rounded-lg object-cover transition duration-1000",
                  {
                    "opacity-50": !isActive,
                  }
                )}
              ></Image>
            )}
          </SwiperSlide>

          <button
            id="slide-prev"
            className="absolute inset-y-0 left-2 z-40 my-auto max-h-fit rounded-full bg-zinc-100 p-2 transition hover:bg-zinc-100 active:bg-zinc-100/50 disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:active:bg-zinc-100"
          >
            <ChevronLeftIcon className="text-neutral h-6 w-6 "></ChevronLeftIcon>
          </button>

          <button
            id="slide-next"
            className="absolute inset-y-0 right-2 z-40 my-auto max-h-fit rounded-full bg-zinc-100 p-2 transition hover:bg-zinc-200 active:bg-zinc-100/50 disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:active:bg-zinc-100"
          >
            <ChevronRightIcon className="text-neutral h-6 w-6"></ChevronRightIcon>
          </button>
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

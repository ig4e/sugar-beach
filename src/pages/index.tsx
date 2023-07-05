import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { type NextPage } from "next";
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
import MainLayout from "~/components/layout/MainLayout";
import { api } from "~/utils/api";

const HomePage: NextPage = () => {
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
          className="h-full max-h-96 overflow-hidden rounded-xl"
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
                      "aspect-[1040/364] h-full max-h-96 w-full rounded-xl object-cover transition duration-1000",
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

HomePage.displayName = "HomePage";

export default HomePage;

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type Props = {
  images: { src: string; alt: string }[];
};

export default function ImageSlider({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <div className="aspect-[4/3] overflow-hidden [&_.swiper]:h-full [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet-active]:scale-110">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={1200}
        className="h-full"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

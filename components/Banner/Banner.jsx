"use client";

import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    title: "Quantum Financial System",
    description:
      "Quantum Financial System gives immunity against cyber attacks and bad market fluctuations.",
    image: "/trump2.jpg",
  },
  {
    title: "Next-Gen Asset Security",
    description:
      "QFS gives your asset the protection it deserves. Never miss this opportunity.",
    image: "/next-gen.jpg",
  },
];

export default function Banner() {
  return (
    <div className="w-full">
      <Splide
        options={{
          type: "loop",
          autoplay: true,
          interval: 4000,
          pauseOnHover: true,
          arrows: false,
          pagination: true,
          rewind: true,
        }}
        className="overflow-hidden"
      >
        {slides.map((slide, idx) => (
          <SplideSlide key={idx}>
            <div className="mt-14 relative w-full h-[320px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
              <Image
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover bg-center lg:bg-top bg-no-repeat"
                width={8192}
                height={5460}
                priority
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center pt-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">{slide.title}</h2>
                <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto drop-shadow">{slide.description}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-5">
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition text-sm"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="hidden border border-white/30 hover:border-white/50 text-white font-medium px-6 py-3 rounded-full backdrop-blur-sm transition text-sm"
                  >
                    Login Now
                  </Link>
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
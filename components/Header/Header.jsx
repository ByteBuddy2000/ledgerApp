"use client";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Navbar from "../Navbar/Navbar";
import Link from "next/link";

export default function Header() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
    
      {/* Header Content */}
      <div
        className="
          w-full
          h-screen
          md:h-[70vh]
          lg:h-[80vh]
          flex items-center justify-center
          
        "
      >
        <div className="w-full h-full">
          <Splide
            aria-label="Quantum Financial Systems"
            options={{
              type: "fade",
              rewind: true,
              autoplay: true,
              interval: 4000,
              pauseOnHover: true,
              arrows: false,
              pagination: true,
              speed: 1000,
              classes: {
                arrows: "splide__arrows flex justify-between absolute top-1/2 w-full px-4 z-10",
                arrow: "splide__arrow bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition",
                pagination: "splide__pagination flex justify-center gap-2 mt-6",
                page: "splide__pagination__page w-3 h-3 rounded-full bg-blue-600 hover:bg-indigo-500 transition border-2 border-white",
              },
            }}
            className="w-full h-full"
          >
            {[
              {
                title: "Quantum Financial System",
                description:
                  "Quantum Financial System gives immunity against cyber attacks and bad market fluctuations.",
                image: "/trump1.jpg",
              },
              {
                title: "Next-Gen Asset Security",
                description:
                  "QFS gives your asset the protection it deserves. Never miss this opportunity.",
                image: "/trump2.jpg",
              },
            ].map((slide, idx) => (
              <SplideSlide key={idx}>
                <div
                  className="flex flex-col items-center justify-center shadow-2xl p-8 text-center text-white relative overflow-hidden bg-cover bg-center h-full w-full rounded-3xl"
                  style={{
                    backgroundImage: `linear-gradient(120deg, rgba(30,41,59,0.7) 0%, rgba(49,46,129,0.6) 100%), url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-3xl z-0"></div>

                  {/* Decorative gradient ring */}
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-700 via-indigo-500 to-purple-600 opacity-30 blur-2xl z-0"></div>

                  <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10">
                    <span className="text-xs tracking-widest uppercase text-blue-300 mb-3 block font-semibold drop-shadow">
                      Quantum Financial System
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                      {slide.title}
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed font-medium drop-shadow">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/register"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition text-sm"
                      >
                        Register Now
                      </Link>
                      <Link
                        href="/login"
                        className="border border-white/30 hover:border-white/50 text-white font-medium px-6 py-3 rounded-full backdrop-blur-sm transition text-sm"
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
      </div>
    </section>
  );
}
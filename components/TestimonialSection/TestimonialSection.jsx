"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    text: "QFS is revolutionary. I’ve never felt this secure with my crypto portfolio — true peace of mind.",
    name: "Charlotte",
    location: "England",
    img: "/assets/trustpilot.png",
  },
  {
    text: "Quantum Ledger Security is game-changing. It's like having a private bank vault for your crypto.",
    name: "Luck",
    location: "United States",
    img: "/assets/trustpilot.png",
  },
  {
    text: "Je recommande fortement QFS. Sûr, rapide et fiable — c’est l’avenir de la finance numérique.",
    name: "Elise",
    location: "France",
    img: "/assets/trustpilot.png",
  },
];

const duplicated = [...testimonials, ...testimonials];
const CARD_WIDTH = 360;
const GAP = 28;
const SLIDE_WIDTH = CARD_WIDTH + GAP;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full bg-gradient-to-b from-black via-gray-950 to-black py-24 overflow-hidden"
    >
      {/* Ambient glowing rings */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-3xl z-0" />

      <div className="relative container mx-auto px-6 text-center z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Trusted by Thousands
        </motion.h2>

        <motion.div
          className="overflow-hidden w-full"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.2 }}
        >
          <motion.div
            className="flex gap-7"
            style={{
              transform: `translateX(-${index * SLIDE_WIDTH}px)`,
              transition: "transform 0.9s ease-in-out",
              width: `${duplicated.length * SLIDE_WIDTH}px`,
            }}
          >
            {duplicated.map((t, i) => (
              <div
                key={i}
                className="min-w-[360px] max-w-[360px] bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-xl relative text-left"
              >
                {/* Golden quote icon */}
                <div className="absolute -top-7 left-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black w-14 h-14 flex items-center justify-center text-3xl font-serif rounded-full shadow-lg">
                  &ldquo;
                </div>

                <p className="mt-8 mb-6 text-base text-blue-100 leading-relaxed italic">
                  “{t.text}”
                </p>

                <div className="h-px bg-gradient-to-r from-blue-500/40 via-transparent to-blue-500/40 mb-5" />

                <div className="flex items-center gap-4">
                  <img
                    src={t.img}
                    alt="Trustpilot"
                    className="w-12 h-12 object-contain rounded-full border border-white/20 shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                    <span className="text-xs text-gray-400">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

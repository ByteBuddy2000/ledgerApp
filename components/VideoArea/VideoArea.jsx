"use client";

import { motion } from "framer-motion";

export default function VideoArea() {
  return (
    <section className="w-full pt-20 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring" }}
          viewport={{ once: true }}
        >
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/sFX1d7Si3mA?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0"
              title="QFS Intro Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Experience Innovation in Real-Time
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Get to know how the Quantum Financial System is transforming the digital economy through real-time performance, absolute security, and futuristic technologies.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
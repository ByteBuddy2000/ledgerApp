"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

const videos = [
  {
    title: "XRP End Game",
    src: "https://www.youtube.com/embed/sFX1d7Si3mA",
    ytTitle: "$10,000 Ripple XRP End Game",
  },
  {
    title: "Reserve Crypto Incoming",
    src: "https://www.youtube.com/embed/yLeji6EidI8",
    ytTitle: "New World Reserve Cryptocurrency Incoming!",
  },
  {
    title: "Mark Philips Interview",
    src: "https://www.youtube.com/embed/juUgJwBwgWk",
    ytTitle: "Ripple XRP   XRP Army News Welcomes Mark Phillips",
  },
];

export default function FlareNetworkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  return (
    <section
      ref={ref}
      id="tfn"
      className="w-full py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-orange-500">Flare Network</span> Integration
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300 text-lg">
            Empowering smart contract functionality for assets like BTC, XRP, and more — 
            Flare unlocks a new era of DeFi possibilities for retirement, wealth, and trustless finance.
          </p>
        </motion.div>

        {/* Video Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.2 }}
        >
          {videos.map((video, idx) => (
            <motion.div
              key={video.title}
              className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <div className="aspect-video bg-black">
                <iframe
                  src={video.src}
                  title={video.ytTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400">{video.ytTitle}</p>
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            className="bg-gradient-to-tr from-orange-500 to-yellow-400 text-black rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:scale-[1.02] transition"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: videos.length * 0.2 }}
          >
            <div className="flex flex-col items-start">
              <Flame className="mb-4 w-10 h-10" />
              <h4 className="text-2xl font-bold mb-2">Explore More on YouTube</h4>
              <p className="text-sm mb-4">
                Dive deeper into how the Flare Network and XRP ecosystem are shaping the future of decentralized finance.
              </p>
            </div>
            <Link
              href="https://www.youtube.com/channel/UCHACcQVpw_p0n03zZdSt4fg/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold hover:underline"
            >
              Visit Channel <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

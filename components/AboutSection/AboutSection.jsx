"use client";
import { motion } from "framer-motion";
import { BookOpen, Handshake, Lock } from "lucide-react";
import { useRef } from "react";

export default function AboutSection() {
  const videoRef = useRef(null);

  // This will be called when the motion div comes into view
  const handleVideoInView = () => {
    // Try to autoplay when component is in view
    videoRef.current?.play().catch(() => {
      // Autoplay was prevented - no action needed since we removed the play button
    });
  };

  return (
    <section
      id="#about"
      className="relative w-full py-28 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden"
    >
      {/* Optional radial gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2b2b2b40] via-transparent to-transparent opacity-10 pointer-events-none" />

      <div className="relative w-full px-4 md:px-10 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
          {/* Video Area */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1,
              onViewportEnter: handleVideoInView // Trigger when video comes into view
            }}
            transition={{ duration: 1.1, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="relative max-w-2xl w-full">
              <video
                ref={videoRef}
                poster="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032"
                controls
                className="rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full"
                muted // Required for autoplay in most browsers
                autoPlay // Try to autoplay immediately
                playsInline // Important for mobile
                loop // Optional: loop the video
              >
                <source src="/qfsvailt.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, type: "spring" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What is the Quantum Financial System?
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base text-justify">
              The Quantum Financial System is a revolutionary shift in global economics, designed to
              replace the corrupt centralized debt system. It provides unparalleled protection against
              fraud, cyber threats, and market manipulation using advanced AI and interdimensional-grade tech.
              <br /><br />
              This secure, decentralized system is more than a financial upgrade — it's your gateway
              to preserving wealth, 401k retirement, and financial sovereignty.
            </p>

            <div className="space-y-6 mb-10">
              <Feature
                icon={<Lock className="text-blue-500" size={28} />}
                title="Military-Grade Security"
                description="Built for trustless and tamper-proof transactions, immune to cyber threats."
              />
              <Feature
                icon={<Handshake className="text-purple-500" size={28} />}
                title="Transparent & Decentralized"
                description="All transactions are immutable, traceable, and fair across the board."
              />
              <Feature
                icon={<BookOpen className="text-green-500" size={28} />}
                title="Education-Backed Empowerment"
                description="Knowledge is wealth — understand how QFS supports retirement growth."
              />
            </div>

            <a
              href="https://www.qfs1776.com/_files/ugd/a16bfe_46e53371c3924d10a587d58fb9e5a0e1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition duration-300"
            >
              <BookOpen size={18} /> Download QFS Manual
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-white/10 rounded-xl">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function QFSCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  return (
    <section className="w-full pt-24 pb-20 bg-white" id="about" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-14">
          {/* Content Section */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, type: "spring" }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Get Your QFS Card & Shop in Over 118 Countries
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              Sign up now to synchronize your digital wallets with the Quantum Financial System. With the QFS card, you’ll unlock ultra-secure transactions, fast global transfers, and access to exclusive technologies like quantum medbeds, computers, and Q-phones.
            </p>

            <ul className="space-y-6 mb-10">
              {[
                {
                  icon: "https://img.icons8.com/?size=96&id=23279&format=png",
                  title: "Sign Up",
                  desc: "Create your QFS account and complete secure onboarding with identity verification.",
                },
                {
                  icon: "https://img.icons8.com/?size=96&id=63760&format=png",
                  title: "Wait for Approval",
                  desc: "Once KYC is approved, sync your wallet and optionally apply for a humanitarian project.",
                },
                {
                  icon: "https://img.icons8.com/?size=96&id=3EFzPFftonWA&format=png",
                  title: "Get Your QFS Card",
                  desc: "Enjoy seamless global payments and access to next-gen quantum tools and platforms.",
                },
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="pt-1">
                    <img src={step.icon} width={40} height={40} alt={step.title} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, type: "spring" }}
          >
            <Image
              src="/assets/QFSCard.png"
              alt="QFS Credit Card"
              className="rounded-2xl shadow-2xl border border-gray-200 w-full h-auto max-w-sm sm:max-w-md"
              width={400}
              height={260}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

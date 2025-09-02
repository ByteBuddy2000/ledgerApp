"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, Link2, Landmark } from "lucide-react"; // Lucide icons
import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <section className="w-full pt-24 pb-20 bg-gray-50" id="hiw">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          {/* Text Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, type: "spring" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              How It Works
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              The Quantum Financial System (QFS) merges quantum tech with digital finance to
              revolutionize trust, speed, and safety. Built to dismantle legacy corruption, it ensures
              real-time verification, asset protection, and total transparency.
            </p>

            <div className="space-y-6 mb-10">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Create Your Account
                  </h4>
                  <p className="text-sm text-gray-600">
                    Begin with a secure profile – your personal key to the quantum-powered economy.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Link Your Wallet
                  </h4>
                  <p className="text-sm text-gray-600">
                    Integrate your crypto wallet for 24/7 digital monitoring and instant authentication.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Access QFS Loans
                  </h4>
                  <p className="text-sm text-gray-600">
                    Receive optimized lending decisions with real-time AI-based risk analysis.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg relative aspect-[3/2]">
              <Image
                src="/xrp-banner.png"
                alt="How It Works"
                className="rounded-3xl shadow-xl border border-gray-200 object-cover"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                placeholder="blur"
                blurDataURL="/xrp-banner.png"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
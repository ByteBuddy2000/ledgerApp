"use client";
import { motion } from "framer-motion";


export default function TouchSection() {
  return (
    <section id="#contact" className="w-full py-0">
      <h4 className="text-center text-indigo-900 text-2xl font-bold mb-6">Contact Us</h4>
      <div className="container mx-auto flex flex-col lg:flex-row items-stretch min-h-screen">
        {/* Left Panel - Form & Background Image */}
        <motion.div
          className="lg:w-1/2 w-full bg-[#00185A] text-white relative flex flex-col justify-center items-center p-6 sm:p-10 overflow-hidden"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
        >
          {/* Blinking background image (team) */}
          <motion.img
            src="/assets/contact-banner.png"
            alt="Team Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Form */}
          <div className="relative z-10 w-full max-w-xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Make Enquiry</h2>
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
              />
              <textarea
                placeholder="Message"
                rows="5"
                className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Panel - Data Image */}
        <motion.div
          className="lg:w-1/2 w-full flex items-center justify-center bg-white"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
        >
          <div className="w-full max-w-3xl p-6">
            <img
              src="/assets/Credit-Card-Mockup.png"
              alt="Data Visualization"
              className="w-full h-auto object-contain rounded-lg shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <footer className="w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-20 pb-10 border-t " ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* QFS LEDGER */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">QFS Vault</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Quantum Financial System (QFS) Vault delivers unmatched security and transparency for all currency holders.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">

              With advanced technology and gold-backed currencies, QFS sets a new standard in global finance.

            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About QFS
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white transition">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-white cursor-pointer transition">
                Digital Currency Protection
              </li>
              <li className="text-gray-400 hover:text-white cursor-pointer transition">
                Wallet Security System
              </li>
              <li className="text-gray-400 hover:text-white cursor-pointer transition">
                Mobile & Web Banking
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="font-medium text-white">Email:</span>{" "}
                <Link
                  href="mailto:support@authorizedqfsvault.com"
                  className="hover:text-white transition"
                >
                  support@authorizedqfsvault.com
                </Link>
              </li>
              <li>
                <span className="font-medium text-white">Support:</span>{" "}
                <Link
                  href="mailto:support@authorizedqfsvault.com"
                  className="hover:text-white transition"
                >
                  support@authorizedqfsvault.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Website Certification */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Certification</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/certification"
                  className="hover:text-white transition underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certification Validity
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 text-center text-xs text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          &copy; {new Date().getFullYear()} QFS Vault. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}

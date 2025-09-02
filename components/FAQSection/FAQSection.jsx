"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "WHAT IS QFS LEDGER VAULT?",
    answer:
      "QUANTUM FINANCIAL SYSTEM is a wallet/digital asset secure system, which gives immunity against cyber attacks and bad market fluctuations.",
  },
  {
    question: "DOES IT MATTER IF I AM NEW TO CRYPTO/DIGITAL MARKET?",
    answer:
      "Not at all. We have a dedicated support system that will guide you through how to manage risk and make the best of your assets.",
  },
  {
    question: "IS SIGN-UP FREE?",
    answer:
      "Yes! Register a free account with QUANTUM FINANCIAL SYSTEM and take your first step to securing your crypto wallet/digital assets.",
  },
  {
    question: "HOW DO I START?",
    answer:
      "First, register a free account, verify your account, then login to your dashboard. Click on 'secure wallet/asset' and follow the instructions.",
  },
  {
    question: "HOW CAN QUANTUM FINANCIAL SYSTEM HELP MY FINANCIAL STATUS?",
    answer:
      "QFS is a digital vault that protects your crypto wallet from market fluctuations and fraud.",
  },
  {
    question: "WHEN TO GET PAYOUT?",
    answer:
      "QFS payouts and transactions are seamless and processed automatically by the system.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-indigo-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-700 mt-2 text-sm">
            Possible questions you might like to ask about QFS Vault Security. <br />
            If you need more clarifications, contact support at:{" "}
            <a
              href="mailto:support@authorizedqfsledger.com"
              className="text-indigo-600 underline"
            >
              support@authorizedqfsvault.com
            </a>
          </p>
        </motion.div>

        {/* FAQ Items */}
        <ul className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div
                  className={`${
                    isOpen ? "bg-purple-800 text-white" : "bg-purple-200 text-indigo-900"
                  } rounded-md p-4 shadow-sm`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <span className="font-semibold text-sm md:text-base uppercase">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <FaMinus className="text-white" />
                    ) : (
                      <FaPlus className="text-indigo-800" />
                    )}
                  </button>
                  {isOpen && (
                    <motion.p
                      className="mt-3 text-sm leading-relaxed text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

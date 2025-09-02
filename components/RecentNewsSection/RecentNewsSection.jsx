// Example: components/RecentNewsSection.jsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const news = [
  {
    title: "A Deep Dive into RWA: Why Combining Ondo (ONDO) and Stellar (XLM) Could Be a Winning Strategy",
    url: "https://cryptopanic.com/news/22688157/A-Deep-Dive-into-RWA-Why-Combining-Ondo-ONDO-and-Stellar-XLM-Could-Be-a-Winning-Strategy?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "CryptoDaily",
    time: "3 hours ago",
  },
  {
    title: "Qubetics Presale Taps $18M While Solana ETF Nears Launch and Stellar Grows: Which Is the Next Bull Run Crypto?",
    url: "https://cryptopanic.com/news/22686811/Qubetics-Presale-Taps-18M-While-Solana-ETF-Nears-Launch-and-Stellar-Grows-Which-Is-the-Next-Bull-Run-Crypto?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "Crypto Economy",
    time: "5 hours ago",
  },
  {
    title: "Hyperliquid Resistance, Stellar XLM Market Cap & Why Cold Wallet Is the Best Crypto Today",
    url: "https://cryptopanic.com/news/22686056/Hyperliquid-Resistance-Stellar-XLM-Market-Cap-Why-Cold-Wallet-Is-the-Best-Crypto-Today?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "Live Bitcoin News",
    time: "5 hours ago",
  },
  {
    title: "Top ISO 20022 Cryptos to Watch in 2025: Why XRP, Stellar, XDC & Algorand Lead the Pack",
    url: "https://cryptopanic.com/news/22681314/Top-ISO-20022-Cryptos-to-Watch-in-2025-Why-XRP-Stellar-XDC-Algorand-Lead-the-Pack?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "coinpedia",
    time: "9 hours ago",
  },
  {
    title: "XLM Price Prediction: Will Stellar Breakout After 25% Drop?",
    url: "https://cryptopanic.com/news/22671723/XLM-Price-Prediction-Will-Stellar-Breakout-After-25-Drop?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "coinpedia",
    time: "15 hours ago",
  },
  {
    title: "Remote in Web3: 10 Roles You Can Apply For This Week",
    url: "https://cryptopanic.com/news/22653978/Remote-in-Web3-10-Roles-You-Can-Apply-For-This-Week?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM",
    source: "Feed - Cryptopolitan.Com",
    time: "a day ago",
  },
];

export default function RecentNewsSection() {
  return (
    <section className="pt-24 pb-16 bg-white" id="rn">
      <motion.div
        className="max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-lg p-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-10">
          <Link
            href="https://cryptopanic.com/?utm_source=widgets&utm_medium=news_widget&utm_campaign=authorizedqfsledger.com&utm_content=XLM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-xl"
          >
            Recent News
            <img
              src="https://static.cryptopanic.com/static/img/cryptopanic-logo-wolf-only.svg"
              width={32}
              height={32}
              alt="CryptoPanic"
              className="inline-block"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, idx) => (
            <motion.div
              key={item.url}
              className="border-b pb-6 last:border-b-0 flex flex-col justify-between min-h-[120px]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline font-semibold text-lg mb-2"
              >
                {item.title}
              </Link>
              <div className="text-xs text-gray-500 mt-auto">
                {item.time} | {item.source}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
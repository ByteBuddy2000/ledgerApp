import axios from "axios";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";
import BalanceDisplay from "./BalanceDisplay";
import totalUserAssetBalance from "@/controllers/TotalUserAssetBalance";

// Coin slug map
const coinSlugMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binancecoin",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  DOGE: "dogecoin",
  TRX: "tron",
  DOT: "polkadot",
  SHIB: "shiba-inu",
};

export default async function CardCarousel({ userIdOrEmail, walletId = "0xABC123...DEF456" }) {
  // Get total balance from shared controller
  const totalUsd = await totalUserAssetBalance(userIdOrEmail);

  const formattedBalance = Number(totalUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shortWallet = walletId?.slice(0, 6) + "..." + walletId?.slice(-4);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="bg-gradient-to-bl from-blue-900 via-black to-indigo-900 text-white rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border border-white/50">
        {/* Verified Badge */}
        <div className="cursor-pointer absolute top-4 right-4 flex items-center gap-1 text-xs sm:text-sm bg-green-600 px-3 py-1.5 rounded-full shadow">
          <BadgeCheck size={16} className="text-white" />
          Verified
        </div>

        {/* Header Section */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-blue-300 mt-1 font-mono">
            Wallet: <span className="font-bold">{shortWallet}</span>
          </p>
        </div>

        {/* Balance Display */}
        <BalanceDisplay formattedBalance={formattedBalance} />

        {/* CTA */}
        <div className="flex justify-center sm:justify-end mt-8">
          <Link
            href="/dashboard/transactions"
            className="text-xs sm:text-sm px-5 py-2 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition shadow"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
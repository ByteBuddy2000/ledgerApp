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
      <div className="bg-gradient-to-br from-blue-800 via-violet-800 to-indigo-900 text-white rounded-2xl shadow-2xl p-5 sm:p-6 relative overflow-hidden border border-blue-600">
        {/* Verified Badge */}
        <div className="cursor-pointer absolute top-3 right-3 flex items-center gap-1 text-[11px] sm:text-sm bg-green-600 px-2.5 py-1 rounded-full shadow-sm">
          <BadgeCheck size={14} className="text-white" />
          Verified
        </div>

        {/* Header Section */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-blue-300 mt-1">
            Wallet: {shortWallet}
          </p>
        </div>

        {/* Balance Display */}
        <BalanceDisplay formattedBalance={formattedBalance} />

        {/* CTA */}
        <div className="flex justify-center sm:justify-end mt-6">
          <Link
            href="/dashboard/transactions"
            className="text-xs sm:text-sm px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
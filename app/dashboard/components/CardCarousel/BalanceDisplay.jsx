"use client";
import { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, Wallet2, Coins } from "lucide-react";

export default function BalanceDisplay({ formattedBalance, assets = [], change24h = 0 }) {
  const [show, setShow] = useState(true);

  // Calculate total coins and top asset
  const totalCoins = assets.length;
  const topAsset = assets[0]?.coin || "USDT";
  const topAssetAmount = assets[0]?.amount || 0;

  // Format 24h change
  const changeColor = change24h > 0 ? "text-green-400" : change24h < 0 ? "text-red-400" : "text-gray-400";
  const changeIcon = change24h > 0 ? <ArrowUpRight size={18} /> : change24h < 0 ? <ArrowDownRight size={18} /> : null;

  return (
    <div className="my-4 w-full">
      <div className="flex items-center gap-2 justify-between sm:justify-start mb-2">
        <div className="flex items-center gap-2">
          <Wallet2 className="text-yellow-400" size={22} />
          <p className="text-sm text-white/80 font-semibold">Total Balance</p>
        </div>
        <button
          type="button"
          className="ml-2 text-emerald-400 hover:text-yellow-400 transition"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide balance" : "Show balance"}
        >
          {show ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/80 rounded-2xl shadow-lg px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start flex-1">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-1">
            {show ? `$${formattedBalance}` : "••••••••"}
          </h3>
          <div className={`flex items-center gap-2 ${changeColor} text-sm font-semibold`}>
            {changeIcon}
            <span>{change24h > 0 ? "+" : ""}{change24h}%</span>
            <span className="ml-2 text-xs text-gray-400">24h</span>
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="flex items-center gap-2">
            <Coins className="text-blue-400" size={18} />
            <span className="text-sm text-white/80 font-medium">{totalCoins} Coins</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-900/60 px-2 py-1 rounded text-blue-300 font-mono">{topAsset}</span>
            <span className="text-xs text-white/70">{topAssetAmount}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-400 px-1">
        <span>Updated just now</span>
      </div>
    </div>
  );
}
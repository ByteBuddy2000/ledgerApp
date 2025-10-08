"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownToLine,
  Coins,
  Send,
  WalletCards,
  Briefcase,
  ShieldAlert,
  LineChart,
} from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// 🔧 Define action buttons (added Stocks)
const actions = [
  { label: "Deposit", modal: "deposit", icon: <Send size={20} /> },
  { label: "Withdrawal", modal: "withdrawal", icon: <ArrowDownToLine size={20} /> },
  { label: "Buy", modal: null, icon: <WalletCards size={20} /> },
  { label: "Stocks", modal: null, icon: <LineChart size={20} /> },
  { label: "401k", modal: null, icon: <Briefcase size={20} /> },
  { label: "FBI", modal: null, icon: <ShieldAlert size={20} /> },
];

// Framer Motion configs
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } };

// 🌟 Reusable Modal Container
function ModalTemplate({ title, onClose, children }) {
  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md bg-slate-900 rounded-xl text-white p-6 z-10 border border-white/80 shadow-xl"
        variants={modalVariants}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-400 text-2xl font-bold">&times;</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function DepositModal({ onClose }) {
  const [coin, setCoin] = useState("");
  const [copied, setCopied] = useState(false);

  // Make sure the keys match the cryptoOptions values
  const walletAddresses = {
    btc: "bc1q876w5vxqlpgzyyxzhxr24chalg5z74ztvp75dp",
    eth: "0xfE09a5D6Cd24f4E6172627011b85866DE3fBf447",
    sol: "GtVu1NbCoowWyfknjrWe9ajL4BDF74MjkcitryVpa3bh",
    usdt: "TRr2kB36MdKnXanodWFyp5D9zub1tLxpCm", // USDT (TRC20)
    usdterc20: "0xfE09a5D6Cd24f4E6172627011b85866DE3fBf447", // USDT (ERC20)
    dogecoin: "DFFG4fyPghR6njzwKGtFMWk37uiN3GDqh3",
    xrp: "rp5PMThCE9FtANy7ULtN4X43fNf7oXW6mt",
    xlm: "GD33L52SYG7NFBQQYGHBU4JIKSAK2M7AMXWXHT5KUVW6ZA5PN5HKMWNO",
    bnb: "0xfE09a5D6Cd24f4E6172627011b85866DE3fB447"
  };

  const address = walletAddresses[coin];

  const cryptoOptions = [
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "usdt", label: "USDT (TRC20)" },
    { value: "usdterc20", label: "USDT (ERC20)" },
    { value: "dogecoin", label: "Dogecoin" },
    { value: "xrp", label: "XRP" },
    { value: "xlm", label: "Stellar" },
    { value: "bnb", label: "Binance Coin" }
  ];

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ModalTemplate title="Deposit Funds" onClose={onClose}>
      <div className="space-y-4 text-sm">
        <div>
          <label className="block mb-1">Choose Crypto</label>
          <Select onValueChange={setCoin}>
            <SelectTrigger className="w-full bg-slate-800 text-white border border-slate-700">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {cryptoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {coin && address && (
          <div className="bg-slate-800 border border-slate-700 rounded p-4 text-sm space-y-2">
            <p>
              Send <strong>{cryptoOptions.find(o => o.value === coin)?.label || coin.toUpperCase()}</strong> to this wallet address:
            </p>
            <div className="relative bg-slate-700 p-2 pr-16 rounded font-mono break-all text-green-400">
              {address}
              <button
                onClick={handleCopy}
                className="absolute top-1/2 -translate-y-1/2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-yellow-300">
              Only send {cryptoOptions.find(o => o.value === coin)?.label || coin.toUpperCase()} on its supported network. Wrong deposits will not be recovered.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 rounded py-2 font-semibold text-white transition"
        >
          Done
        </button>
      </div>
    </ModalTemplate>
  );
}
function WithdrawalModal({ userId, onClose }) {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`/api/assets`);
        const data = await res.json();
        console.log("Fetched assets:", data.assets); // Add this line
        if (res.ok) setAssets(data.assets || []);
        else console.error("Failed to fetch assets:", data.error || res.statusText);
      } catch (err) {
        console.error("Server error while fetching assets", err);
      }
    };

    fetchAssets();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!selectedAsset || !amount || !wallet) {
      toast.error("Please fill in all fields");
      return;
    }

    const parts = selectedAsset.split(":");
    if (parts.length !== 2) {
      toast.error("Invalid asset selection");
      return;
    }

    const [coin, network] = parts;

    setProcessing(true);
    console.log({ userId, coin, network, amount, walletAddress: wallet });

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          coin,
          network,
          amount: parseFloat(amount),
          walletAddress: wallet,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Transaction is being Processed!");
        onClose();
      } else {
        console.error("Withdrawal API error:", data.error || data);
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Withdrawal request failed:", err);
      toast.error("Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const uniqueAssets = Array.from(
    new Map(assets.map((a) => [`${a.coin}:${a.network}`, a])).values()
  );

  return (
    <ModalTemplate title="Withdraw Funds" onClose={onClose}>
      {processing ? (
        <p className="text-blue-400 text-center">Processing withdrawal...</p>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1">Choose Asset</label>
            <Select onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full bg-slate-800 text-white border border-slate-700">
                <SelectValue placeholder="Select coin & network" />
              </SelectTrigger>
              <SelectContent>
                {uniqueAssets.map((asset) => (
                  <SelectItem
                    key={`${asset.coin}:${asset.network}`}
                    value={`${asset.coin}:${asset.network}`}
                  >
                    {asset.coin.toUpperCase()} ({asset.network})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-white"
              placeholder="e.g. 100"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Wallet Address</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-white"
              placeholder="e.g. bc1qxyz..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2 font-semibold text-white transition"
            disabled={processing}
          >
            {processing ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>
      )}
    </ModalTemplate>
  );
}
// 📦 ActionButtons Main Component
const ActionButtons = ({ userId }) => {
  const [modal, setModal] = useState(null);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-6 px-2 sm:px-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
        {actions.map(({ label, modal: modalType, icon }) => {
          const buttonClass =
            "w-[80px] h-[80px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 transition";
          if (label === "FBI") {
            return (
              <Link key={label} href="/dashboard/fbi" className={buttonClass} title="Submit Complaint">
                <div className="text-red-400">{icon}</div>
                <span className="text-xs">{label}</span>
              </Link>
            );
          }
          if (label === "Stocks") {
            return (
              <Link key={label} href="/dashboard/stocks" className={buttonClass} title="View Stocks">
                <div className="text-blue-400">{icon}</div>
                <span className="text-xs">{label}</span>
              </Link>
            );
          }
          return modalType ? (
            <button key={label} onClick={() => setModal(modalType)} className={buttonClass}>
              <div className="text-blue-400">{icon}</div>
              <span className="text-xs">{label}</span>
            </button>
          ) : (
            <Link key={label} href={`/dashboard/${label.toLowerCase()}`} className={buttonClass}>
              <div className="text-green-400">{icon}</div>
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>

      <AnimatePresence>
        {modal === "deposit" && <DepositModal onClose={() => setModal(null)} />}
        {modal === "withdrawal" && (
          <WithdrawalModal userId={userId} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionButtons;

"use server"
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserAsset from "@/models/UserAsset";
import { connectToDB } from "@/lib/connectDB";

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
  XLM: "stellar"
};

export default async function getUserAssets() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const User = (await import("@/models/User")).default;
  const user = await User.findOne({ email: session.user.email });
  if (!user) return [];

  // Use the correct field name for user reference
  const rawAssets = await UserAsset.find({ user: user._id });

  // ADD LOG HERE
  // console.log("Raw User Assets from DB:", rawAssets);

  // Get all unique coins in uppercase
  const coins = [...new Set(rawAssets.map(a => a.coin.toUpperCase()))];
  const ids = coins.map(c => coinSlugMap[c]).filter(Boolean).join(",");

  let prices = {};
  if (ids) {
    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids,
        vs_currencies: "usd",
        include_24hr_change: "true",
      },
    });
    // Map prices back to coin symbol, include 24h change
    for (const coin of coins) {
      const slug = coinSlugMap[coin];
      prices[coin] = {
        usd: res.data[slug]?.usd ?? 0,
        change: res.data[slug]?.usd_24h_change ?? 0,
      };
    }
  }

  let totalUsd = 0;

  const assets = rawAssets.map((asset) => {
    const coinUpper = asset.coin.toUpperCase();
    const price = prices[coinUpper]?.usd || 0;
    const priceChange24h = prices[coinUpper]?.change || 0;
    const usdValue = asset.amount * price;
    totalUsd += usdValue;

    return {
      _id: asset._id.toString(),
      userId: asset.user?.toString?.() || asset.userId?.toString?.() || "",
      coin: asset.coin,
      network: asset.network, // include network if present
      amount: asset.amount,
      price, // <-- include price for frontend
      priceChange24h, // <-- include 24h change for frontend
      usdValue,
      createdAt: asset.createdAt?.toISOString(),
      updatedAt: asset.updatedAt?.toISOString(),
    };
  });

  return {
    totalUsd,
    assets,
  };
}

11131
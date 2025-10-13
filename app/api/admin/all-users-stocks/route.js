import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserStock from "@/models/UserStock";

export async function GET(req) {
  await connectToDB();

  // List of all possible stock symbols (expanded to include commodities)
  const allSymbols = [
    "AAPL",
    "GOOGL",
    "MSFT",
    "TSLA",
    "AMZN",
    "NVDA",
    "META",
    "NFLX",
    "XOM",
    "JPM",
    "XAUUSD", // Gold
    "XAGUSD", // Silver
    "XPDUSD", // Palladium
    "XCUUSD", // Copper
    "IRIDIUM", // Iridium
  ];

  // Aggregate UserStock to compute net shares per user per symbol:
  // - treat records with "sell" in status as sell requests; use processedShares as sold amount
  // - treat other statuses as buy records and include shares
  const agg = await UserStock.aggregate([
    {
      $project: {
        user: 1,
        symbol: 1,
        status: 1,
        shares: { $ifNull: ["$shares", 0] },
        processedShares: { $ifNull: ["$processedShares", 0] },
      },
    },
    {
      $addFields: {
        isSell: { $regexMatch: { input: "$status", regex: /sell/i } },
      },
    },
    {
      $project: {
        user: 1,
        symbol: 1,
        buyShares: { $cond: ["$isSell", 0, "$shares"] },
        soldShares: { $cond: ["$isSell", "$processedShares", 0] },
      },
    },
    {
      $group: {
        _id: { user: "$user", symbol: "$symbol" },
        totalBought: { $sum: "$buyShares" },
        totalSold: { $sum: "$soldShares" },
      },
    },
    {
      $project: {
        user: "$_id.user",
        symbol: "$_id.symbol",
        netShares: { $max: [{ $subtract: ["$totalBought", "$totalSold"] }, 0] },
      },
    },
    {
      $group: {
        _id: "$user",
        stocks: { $push: { symbol: "$symbol", shares: "$netShares" } },
      },
    },
  ]);

  // Build a map userId -> { symbol: shares }
  const userStocksMap = {};
  for (const entry of agg) {
    const uid = String(entry._id);
    userStocksMap[uid] = {};
    for (const s of entry.stocks) {
      userStocksMap[uid][s.symbol] = s.shares;
    }
  }

  // Get all users
  const users = await User.find({}).lean();

  // Build result: include allSymbols, fill missing with 0
  const result = users.map((user) => {
    const stocksObj = userStocksMap[String(user._id)] || {};
    const stocksList = allSymbols.map((symbol) => ({
      symbol,
      shares: Number(stocksObj[symbol] || 0),
    }));

    return {
      id: String(user._id),
      name: user.username || user.name || user.email || "Unknown",
      email: user.email,
      avatar: user.avatar || "",
      stocks: stocksList,
    };
  });

  return Response.json({ users: result });
}

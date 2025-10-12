import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserStock from "@/models/UserStock";

export async function GET(req) {
  await connectToDB();

  // Get all users
  const users = await User.find({}).lean();

  // Get all stocks for all users
  const stocks = await UserStock.find({}).lean();

  // Build a map of userId to their stocks
  const userStocksMap = {};
  stocks.forEach(stock => {
    const uid = String(stock.user);
    if (!userStocksMap[uid]) userStocksMap[uid] = [];
    userStocksMap[uid].push({ symbol: stock.symbol, shares: stock.shares });
  });

  // List of all possible stock symbols (can be expanded)
  const allSymbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "NFLX", "XOM", "JPM"];

  // Build user list with stocks (fill missing stocks with 0)
  const result = users.map(user => {
    const stocksArr = userStocksMap[String(user._id)] || [];
    // Map stocks to symbol: shares
    const stocksObj = {};
    stocksArr.forEach(s => { stocksObj[s.symbol] = s.shares; });
    // Fill missing stocks with 0
    const stocksList = allSymbols.map(symbol => ({ symbol, shares: stocksObj[symbol] || 0 }));
    return {
      id: String(user._id),
      name: user.username || user.name || user.email,
      email: user.email,
      avatar: user.avatar || "",
      stocks: stocksList,
    };
  });

  return Response.json({ users: result });
}

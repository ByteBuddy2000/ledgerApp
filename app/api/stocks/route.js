import { NextResponse } from "next/server";

export async function GET() {
  const symbols = [
    "AAPL", // Apple
    "TSLA", // Tesla
    "GOOGL", // Alphabet (Google)
    "AMZN", // Amazon
    "MSFT", // Microsoft
    "META", // Meta Platforms (Facebook)
    "NVDA", // Nvidia
    "WMT", // Walmart
    "V", // Visa
    "MA", // Mastercard
    "BAC", // Bank of America
    "JPM", // JPMorgan Chase
    "DIS", // Disney
    "KO", // Coca-Cola
    "PEP", // PepsiCo
    "MCD", // McDonald's
    "SBUX" // Starbucks
  ];
  // add metals/commodities (common FX/commodity tickers)
  // Gold (XAUUSD), Silver (XAGUSD), Palladium (XPDUSD), Iridium (no standard ticker on Finnhub), Copper (XCUUSD)
  symbols.push("XAUUSD", "XAGUSD", "XPDUSD", "XCUUSD", "IRIDIUM");
  const symbolNames = {
    XAUUSD: "Gold (XAU/USD)",
    XAGUSD: "Silver (XAG/USD)",
    XPDUSD: "Palladium (XPD/USD)",
    XCUUSD: "Copper (XCU/USD)",
    IRIDIUM: "Iridium"
  };
  const apiKey = process.env.FINNHUB_KEY;
  const results = [];
  

  for (const symbol of symbols) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const [quoteRes, profileRes] = await Promise.all([
      fetch(url),
      fetch(profileUrl),
    ]);
    const quote = await quoteRes.json();
    const profile = await profileRes.json();

    results.push({
      symbol,
      name: profile.name || symbolNames[symbol] || symbol,
      price: quote.c || 0,
      change: quote.dp || 0,
      logo: profile.logo || "",
    });
  }

  return NextResponse.json({ stocks: results });
}
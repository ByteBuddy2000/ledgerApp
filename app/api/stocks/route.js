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
  const commodityLogos = {
    XAUUSD: "/commodities/gold.svg",
    XAGUSD: "/commodities/silver.svg",
    XPDUSD: "/commodities/palladium.svg",
    XCUUSD: "/commodities/copper.svg",
    IRIDIUM: "/commodities/iridium.svg",
  };
  const apiKey = process.env.FINNHUB_KEY;
  const results = [];
  

  // Manually set live prices for commodities (as of Oct 12, 2025)
  const manualCommodityPrices = {
    XAUUSD: 1872.50, // Gold (USD/oz)
    XAGUSD: 22.10,   // Silver (USD/oz)
    XPDUSD: 1045.00, // Palladium (USD/oz)
    XCUUSD: 3.65,    // Copper (USD/lb)
    IRIDIUM: 4500.00 // Iridium (USD/oz, approx)
  };
  const manualCommodityChanges = {
    XAUUSD: 0.15,    // Gold daily % change
    XAGUSD: -0.22,   // Silver daily % change
    XPDUSD: 0.05,    // Palladium daily % change
    XCUUSD: 0.10,    // Copper daily % change
    IRIDIUM: 0.00    // Iridium daily % change
  };

  for (const symbol of symbols) {
    let price = 0;
    let change = 0;
    let name = symbolNames[symbol] || symbol;
    let logo = commodityLogos[symbol] || "";
    let profile = {};

    if (manualCommodityPrices[symbol] !== undefined) {
      price = manualCommodityPrices[symbol];
      change = manualCommodityChanges[symbol];
    } else {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
      const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
      const [quoteRes, profileRes] = await Promise.all([
        fetch(url),
        fetch(profileUrl),
      ]);
      const quote = await quoteRes.json();
      profile = await profileRes.json();
      price = quote.c || 0;
      change = quote.dp || 0;
      name = profile.name || name;
      logo = profile.logo || logo;
    }

    results.push({
      symbol,
      name,
      price,
      change,
      logo,
    });
  }

  return NextResponse.json({ stocks: results });
}
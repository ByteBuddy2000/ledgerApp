import { NextResponse } from "next/server";

export async function GET() {
  const symbols = [
    "AAPL", "TSLA", "GOOGL", "AMZN",
    "QZ-GOLD", "QZ-SILVER", "OZ-PALLADIUM", "OZ-IRIDIUM", "QZ-COPPER"
  ];
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
      name: profile.name || symbol,
      price: quote.c || 0,
      change: quote.dp || 0,
      logo: profile.logo || "",
    });
  }

  return NextResponse.json({ stocks: results });
}
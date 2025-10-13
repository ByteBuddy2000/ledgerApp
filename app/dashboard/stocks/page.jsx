"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StockPage = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [userStocks, setUserStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("market");

  // ✅ Fetch all available stocks
  const fetchAllStocks = async () => {
    try {
      const res = await fetch("/api/stocks");
      const data = await res.json();
      setAllStocks(data || []);
    } catch (err) {
      console.error("Error fetching all stocks:", err);
      toast.error("Failed to load stocks");
    }
  };

  // ✅ Fetch user’s holdings (approved)
  const fetchUserStocks = async () => {
    try {
      const res = await fetch("/api/user-stocks?approved=true");
      const data = await res.json();
      setUserStocks(data || []);
    } catch (err) {
      console.error("Error fetching user stocks:", err);
      toast.error("Failed to load your stocks");
    }
  };

  // ✅ Refresh both stock lists
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchAllStocks(), fetchUserStocks()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // ✅ Buy Stock
  const handleBuy = async (symbol) => {
    try {
      const res = await fetch("/api/user-stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Buy request for ${symbol} sent`);
        refreshData();
      } else {
        toast.error(data.message || "Failed to buy");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error buying stock");
    }
  };

  // ✅ Sell Stock
  const handleSell = async (symbol) => {
    try {
      const res = await fetch("/api/user-stocks/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Sell request for ${symbol} sent`);
        refreshData();
      } else {
        toast.error(data.message || "Failed to sell");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error selling stock");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#0a0f1a] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">📈 Stock Dashboard</h1>

      <Tabs defaultValue="market" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 p-1 rounded-xl w-full md:w-auto">
          <TabsTrigger value="market" className="w-1/2 md:w-auto">Market</TabsTrigger>
          <TabsTrigger value="portfolio" className="w-1/2 md:w-auto">My Holdings</TabsTrigger>
        </TabsList>

        {/* ✅ Market Tab */}
        <TabsContent value="market" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-gray-400">Loading stocks...</p>
          ) : allStocks.length === 0 ? (
            <p className="text-gray-400">No stocks available</p>
          ) : (
            allStocks.map((stock) => (
              <Card key={stock.symbol} className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{stock.symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-2">{stock.name}</p>
                  <p className="text-lg font-semibold mb-4">${stock.price?.toFixed(2)}</p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBuy(stock.symbol)}
                  >
                    Buy
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ✅ Portfolio Tab */}
        <TabsContent value="portfolio" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-gray-400">Loading your holdings...</p>
          ) : userStocks.length === 0 ? (
            <p className="text-gray-400">You don’t have any stocks yet.</p>
          ) : (
            userStocks.map((holding) => (
              <Card key={holding._id} className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{holding.symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-1">
                    Shares: <span className="font-semibold">{holding.shares}</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    Buy Price: <span className="font-semibold">${holding.buyPrice?.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    Current Value:{" "}
                    <span className="font-semibold">
                      ${(holding.shares * holding.currentPrice).toFixed(2)}
                    </span>
                  </p>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleSell(holding.symbol)}
                  >
                    Sell
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockPage;

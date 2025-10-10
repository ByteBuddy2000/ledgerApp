"use client"
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, LineChart } from "lucide-react";
import NavHeader from "../components/NavHeader/NavHeader";

const TransactionPage = () => {
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [sentTransactions, setSentTransactions] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.success) {
          setReceivedTransactions(data.deposits || []);
          setSentTransactions(data.withdrawals || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    async function fetchUserStocks() {
      try {
        // Fetch all user stock transactions (approved, pending, rejected)
        const res = await fetch("/api/user-stocks?all=true");
        const data = await res.json();
        if (data.success && Array.isArray(data.stocks)) {
          setStockTransactions(data.stocks);
        }
      } catch (error) {
        console.error("Error fetching user stocks:", error);
      }
    }

    fetchTransactions();
    fetchUserStocks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#05011aff] via-[#000000] to-[#001F3F] py-10 px-4">
      <div className="max-w-6xl mx-auto px-4">
        <NavHeader />

        <Card className="glass-card border-none p-6">
          <CardHeader>
            <CardTitle>
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent text-2xl font-extrabold drop-shadow-lg">
                Transaction History
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full mx-auto">
              <TabsList className="mx-auto mb-4 flex gap-2 bg-gray-900/80 p-2 rounded-xl shadow-lg border border-gray-700">
                <TabsTrigger
                  value="received"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 transition border border-transparent data-[state=active]:border-green-500"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Received</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 transition border border-transparent data-[state=active]:border-red-500"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sent</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stocks"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 transition border border-transparent data-[state=active]:border-blue-500"
                >
                  <LineChart className="w-4 h-4" />
                  <span>Stocks</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="received">
                {receivedTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No received transactions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedTransactions.map((tx) => (
                      <div
                        key={tx._id}
                        className="relative p-5 rounded-xl border border-sky-600/30 bg-gradient-to-br from-sky-900/60 via-slate-900/60 to-black/70 shadow-lg hover:shadow-sky-400/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-sky-200">
                              +{tx.amount.toLocaleString()} {tx.coin}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-sky-400 uppercase">
                              {tx.status}
                            </span>
                            <span className="mt-1 text-xs text-sky-100">
                              Deposit
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-400 to-cyan-400 rounded-t-xl animate-pulse opacity-50" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sent">
                {sentTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No sent transactions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentTransactions.map((tx) => (
                      <div
                        key={tx._id}
                        className="relative p-5 rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-900/60 via-slate-900/60 to-black/70 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-yellow-200">
                              -{tx.amount.toLocaleString()} {tx.coin}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-yellow-400 uppercase">
                              {tx.status}
                            </span>
                            <span className="mt-1 text-xs text-yellow-100">
                              Withdrawal
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 rounded-t-xl animate-pulse opacity-50" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="stocks">
                {stockTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No stock transactions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stockTransactions.map((stock) => (
                      <div
                        key={stock._id}
                        className="relative p-5 rounded-xl border border-green-600/30 bg-gradient-to-br from-green-900/60 via-slate-900/60 to-black/70 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-green-200">
                              {stock.shares} shares of {stock.symbol}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              Bought at ${stock.price} each
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {stock.createdAt && !isNaN(new Date(stock.createdAt)) 
                                ? new Date(stock.createdAt).toLocaleString() 
                                : "Date unavailable"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-semibold uppercase
                              ${stock.status === "pending" ? "text-yellow-400" : ""}
                              ${stock.status === "approved" ? "text-green-400" : ""}
                              ${stock.status === "rejected" ? "text-red-500" : ""}
                            `}>
                              {stock.status}
                            </span>
                            <span className="mt-1 text-xs text-gray-300">
                              Stock Purchase
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-blue-600 rounded-t-xl animate-pulse opacity-50" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionPage;
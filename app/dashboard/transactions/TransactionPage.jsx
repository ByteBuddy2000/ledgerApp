"use client";
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
        const res = await fetch("/api/user-stocks?all=true");
        const data = await res.json();
        if (data.success && Array.isArray(data.stocks)) {
          setStockTransactions(data.stocks);
        }
      } catch (error) {
        console.error("Error fetching user stocks:", error);
      }
    }

    async function markAllRead() {
      try {
        await fetch("/api/transactions/mark-read", { method: "POST" });
      } catch {}
    }

    fetchTransactions();
    fetchUserStocks();
    markAllRead();
  }, []);

  const renderCard = (tx, type) => {
    const color =
      type === "received"
        ? "sky"
        : type === "sent"
        ? "yellow"
        : "green";

    const icon =
      type === "received" ? "+" : type === "sent" ? "−" : "S";

    const bgColor =
      type === "received"
        ? "bg-sky-700/30"
        : type === "sent"
        ? "bg-yellow-700/30"
        : "bg-green-700/30";

    const amountColor =
      type === "received"
        ? "text-sky-200"
        : type === "sent"
        ? "text-yellow-200"
        : "text-green-200";

    return (
      <div
        key={tx._id}
        className="relative p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center text-lg font-semibold ${amountColor}`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div
                className={`text-lg font-bold ${amountColor} truncate`}
              >
                {type === "received" && "+"}
                {type === "sent" && "-"}
                {tx.amount?.toLocaleString?.() || tx.shares}{" "}
                {tx.coin || tx.symbol}
              </div>
              <div className="text-xs text-gray-400">
                {tx.createdAt && !isNaN(new Date(tx.createdAt))
                  ? new Date(tx.createdAt).toLocaleString()
                  : "Date unavailable"}
              </div>
            </div>

            {/* Details section */}
            <div className="mt-3 text-sm text-gray-300 space-y-1">
              {type === "stocks" ? (
                <>
                  <div>
                    <span className="font-semibold text-white">
                      Shares:
                    </span>{" "}
                    {tx.shares}
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Price:
                    </span>{" "}
                    ${tx.price}
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Status:
                    </span>{" "}
                    <span
                      className={`font-semibold ${
                        tx.status === "pending"
                          ? "text-yellow-400"
                          : tx.status === "confirmed"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-white">
                      Type:
                    </span>{" "}
                    {type === "received" ? "Deposit" : "Withdrawal"}
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      Status:
                    </span>{" "}
                    <span
                      className={`font-semibold ${
                        tx.status === "pending"
                          ? "text-yellow-400"
                          : tx.status === "confirmed"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  {tx.transactionId && (
                    <div className="truncate">
                      <span className="font-semibold text-white">
                        Tx ID:
                      </span>{" "}
                      {tx.transactionId}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#05011aff] via-[#000000] to-[#001F3F] py-10 px-4">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <NavHeader />

        <Card className="border-none bg-black/30 shadow-xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle>
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent text-2xl font-extrabold drop-shadow-lg">
                Transaction History
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="received" className="w-full mx-auto">
              <TabsList className="mx-auto mb-4 flex justify-center flex-wrap gap-2 bg-gray-900/80 p-2 rounded-xl shadow-lg border border-gray-700">
                <TabsTrigger
                  value="received"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 transition"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Received</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 transition"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sent</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stocks"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 transition"
                >
                  <LineChart className="w-4 h-4" />
                  <span>Stocks</span>
                </TabsTrigger>
              </TabsList>

              {/* Received */}
              <TabsContent value="received">
                {receivedTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No received transactions found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {receivedTransactions.map((tx) =>
                      renderCard(tx, "received")
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Sent */}
              <TabsContent value="sent">
                {sentTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No sent transactions found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sentTransactions.map((tx) =>
                      renderCard(tx, "sent")
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Stocks */}
              <TabsContent value="stocks">
                {stockTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">
                    No stock transactions found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {stockTransactions.map((tx) =>
                      renderCard(tx, "stocks")
                    )}
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

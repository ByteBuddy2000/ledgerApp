"use client"
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, LineChart } from "lucide-react";
import NavHeader from "../components/NavHeader/NavHeader";
import { Search } from "lucide-react";

const TransactionPage = () => {
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [sentTransactions, setSentTransactions] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("all");

  const withinTimeframe = (dateStr) => {
    if (!dateStr) return false;
    if (timeframe === 'all') return true;
    const date = new Date(dateStr);
    const now = Date.now();
    const diff = now - date.getTime();
    if (timeframe === '24h') return diff <= 24 * 60 * 60 * 1000;
    if (timeframe === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
    if (timeframe === '30d') return diff <= 30 * 24 * 60 * 60 * 1000;
    return true;
  };

  const filtered = (items) => {
    return (items || []).filter((it) => {
      // status filter
      if (statusFilter !== 'all' && String((it.status || '').toLowerCase()) !== String(statusFilter).toLowerCase()) return false;
      // timeframe filter
      if (!withinTimeframe(it.createdAt)) return false;
      // query: check amount, symbol, user
      if (query && query.trim() !== '') {
        const q = query.trim().toLowerCase();
        const amount = it.amount ? String(it.amount) : '';
        const symbol = it.symbol || it.coin || '';
        const user = it.user?.username || it.user?.email || '';
        if (!(amount.toLowerCase().includes(q) || String(symbol).toLowerCase().includes(q) || String(user).toLowerCase().includes(q))) return false;
      }
      return true;
    });
  };

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

    async function markAllRead() {
      try {
        await fetch("/api/transactions/mark-read", { method: "POST" });
      } catch (err) {}
    }

    fetchTransactions();
    fetchUserStocks();
    markAllRead();
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
            {/* Filter Bar */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="flex items-center gap-2 bg-white/5 border border-white/6 rounded px-3 py-2">
                <Search className="text-gray-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by amount, symbol, or user"
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-full text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/6 text-sm rounded px-3 py-2 text-white">
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="bg-white/5 border border-white/6 text-sm rounded px-3 py-2 text-white">
                  <option value="all">All time</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>

              <div className="flex justify-end">
                <div className="text-sm text-gray-300">Showing filters</div>
              </div>
            </div>

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
                {filtered(receivedTransactions).length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">No received transactions found.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filtered(receivedTransactions).map((tx) => (
                      <div key={tx._id} className="relative p-5 rounded-xl border border-sky-600/10 bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md shadow-lg transition-all duration-300">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-sky-700/30 flex items-center justify-center text-sky-200 text-lg font-semibold">+</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-lg font-bold text-sky-200 truncate">+{tx.amount.toLocaleString()} {tx.coin}</div>
                              <div className="text-xs text-gray-300">{new Date(tx.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-300 truncate">Deposit • Status: <span className="font-semibold text-sky-300">{tx.status}</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sent">
                {filtered(sentTransactions).length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">No sent transactions found.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filtered(sentTransactions).map((tx) => (
                      <div key={tx._id} className="relative p-5 rounded-xl border border-yellow-600/10 bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md shadow-lg transition-all duration-300">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-700/30 flex items-center justify-center text-yellow-200 text-lg font-semibold">-</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-lg font-bold text-yellow-200 truncate">-{tx.amount.toLocaleString()} {tx.coin}</div>
                              <div className="text-xs text-gray-300">{new Date(tx.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-300 truncate">Withdrawal • Status: <span className="font-semibold text-yellow-300">{tx.status}</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="stocks">
                {filtered(stockTransactions).length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-base">No stock transactions found.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filtered(stockTransactions).map((stock) => (
                      <div key={stock._id} className="relative p-5 rounded-xl border border-green-600/10 bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md shadow-lg transition-all duration-300">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-700/30 flex items-center justify-center text-green-200 text-lg font-semibold">S</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-lg font-bold text-green-200 truncate">{stock.shares} shares of {stock.symbol}</div>
                              <div className="text-xs text-gray-300">{stock.createdAt && !isNaN(new Date(stock.createdAt)) ? new Date(stock.createdAt).toLocaleString() : 'Date unavailable'}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-300 truncate">Bought at ${stock.price} • Status: <span className={`font-semibold ${stock.status === 'pending' ? 'text-yellow-400' : stock.status === 'approved' ? 'text-green-400' : 'text-red-500'}`}>{stock.status}</span></div>
                          </div>
                        </div>
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
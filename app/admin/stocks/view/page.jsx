"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit } from "lucide-react";
import { toast } from "sonner";

export default function ViewUserStocksPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingStocks, setEditingStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState("");
  const [newStockShares, setNewStockShares] = useState("");
  const [livePrices, setLivePrices] = useState({});

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
  ];

  // Mock live prices for demo (replace with real API)
  useEffect(() => {
    async function fetchStockPrices() {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();
        const prices = {};
        if (Array.isArray(data.stocks)) {
          for (const stock of data.stocks) {
            prices[stock.symbol] = stock.price;
          }
        }
        setLivePrices(prices);
      } catch (err) {
        setLivePrices({});
      }
    }
    fetchStockPrices();
  }, []);

  // Fetch users and their stocks
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/all-users-stocks${
          searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""
        }`
      );
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  // Edit a user's stocks
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditingStocks(
      Array.isArray(user.stocks)
        ? user.stocks.map((s) => ({ ...s }))
        : []
    );
    setNewStockSymbol("");
    setNewStockShares("");
  };

  const updateStockShares = (index, value) => {
    setEditingStocks((prev) =>
      prev.map((stock, i) =>
        i === index
          ? {
              ...stock,
              shares: Math.max(0, Number.parseFloat(value) || 0),
            }
          : stock
      )
    );
  };

  const addNewStock = () => {
    if (!newStockSymbol || !newStockShares) return;
    setEditingStocks(prev => {
      // If stock exists, update shares; else add new
      const exists = prev.find(s => s.symbol === newStockSymbol);
      if (exists) {
        return prev.map(s =>
          s.symbol === newStockSymbol
            ? { ...s, shares: Math.max(0, Number.parseFloat(newStockShares) || 0) }
            : s
        );
      } else {
        return [
          ...prev,
          { symbol: newStockSymbol, shares: Math.max(0, Number.parseFloat(newStockShares) || 0) },
        ];
      }
    });
    setNewStockSymbol("");
    setNewStockShares("");
  };

  const removeStock = (index) => {
    setEditingStocks(prev =>
      prev.map((stock, i) =>
        i === index ? { ...stock, shares: 0 } : stock
      )
    );
  };

  const handleSaveStocks = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      // Only send stocks with shares > 0, with price
      const stocksToSend = allSymbols.map(symbol => {
        const found = editingStocks.find(s => s.symbol === symbol);
        return {
          symbol,
          shares: found ? found.shares : 0,
          price: livePrices[symbol] || 0,
        };
      }).filter(s => s.shares > 0);
      const res = await fetch("/api/admin/update-stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          stocks: stocksToSend,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Stocks updated successfully");
        setSelectedUser(null);
        setEditingStocks([]);
        await fetchUsers();
      } else {
        toast.error("Failed to update stocks");
      }
    } catch (err) {
      toast.error("Error saving stocks");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 md:p-10 text-white">
    <div className="mb-6">
      <Link href="/admin/stocks">
        <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
          ← Back to Stocks Admin
        </Button>
      </Link>
    </div>
      <div className="flex items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search user by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-800 border-gray-700 text-white"
        />
        <Button onClick={fetchUsers} disabled={loading}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {loading && <p className="text-gray-400">Loading users...</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="bg-gradient-to-br from-gray-950 via-gray-900 to-black border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-700">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user?.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name || "Unnamed User"}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <Dialog
                  open={selectedUser?.id === user.id}
                  onOpenChange={(open) => !open && setSelectedUser(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                      className="text-white"
                    >
                      <Edit className="mr-1 h-4 w-4 text-white" /> Edit
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-gray-800" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">
                        Edit {user.name || user.email}'s Stocks
                      </h2>

                      {editingStocks.length > 0 && (
                        <div className="space-y-4">
                          {editingStocks.map((stock, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-3 bg-gray-800 p-3 rounded"
                            >
                              <div className="flex-1">
                                <p className="text-white font-medium">
                                  {stock.symbol}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Shares
                                </p>
                              </div>
                              <input
                                type="number"
                                step="any"
                                value={stock.shares}
                                onChange={(e) =>
                                  updateStockShares(index, e.target.value)
                                }
                                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-base text-white w-24"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeStock(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Stock */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Add New Stock
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <select
                            value={newStockSymbol}
                            onChange={(e) => setNewStockSymbol(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-4 py-2 text-base text-white w-full md:w-auto"
                          >
                            <option value="">Select Stock</option>
                            {allSymbols.map((symbol) => (
                              <option key={symbol} value={symbol}>
                                {symbol}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            placeholder="Shares"
                            value={newStockShares}
                            onChange={(e) =>
                              setNewStockShares(e.target.value)
                            }
                            className="bg-gray-700 border border-gray-600 rounded px-4 py-2 text-base text-white w-full md:w-auto"
                          />

                          <Button
                            onClick={addNewStock}
                            disabled={!newStockSymbol || !newStockShares}
                          >
                            + Add Stock
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-4 pt-6">
                        <Button
                          variant="destructive"
                          onClick={() => setSelectedUser(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveStocks}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Total Shares</span>
                  <span className="text-lg font-bold text-green-400">
                    {Array.isArray(user.stocks)
                      ? user.stocks.reduce(
                          (sum, s) => sum + (s.shares || 0),
                          0
                        )
                      : 0}
                  </span>
                  <span className="text-sm text-gray-400 ml-4">
                    Total Value
                  </span>
                  <span className="text-lg font-bold text-blue-400">
                    $
                    {Array.isArray(user.stocks)
                      ? user.stocks
                          .reduce(
                            (sum, s) =>
                              sum +
                              (s.shares || 0) * (livePrices[s.symbol] || 0),
                            0
                          )
                          .toLocaleString()
                      : "0"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Stocks (
                    {Array.isArray(user.stocks) ? user.stocks.length : 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(user.stocks) ? user.stocks : []).map(
                      (stock, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-gray-700 text-white text-xs"
                        >
                          {stock.symbol}:{" "}
                          {stock.shares?.toLocaleString()} shares
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import NavHeader from "../components/NavHeader/NavHeader";

const TransactionPage = () => {
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [sentTransactions, setSentTransactions] = useState([]);

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

    fetchTransactions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <NavHeader />

      <Card className="border-none bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <CardHeader>
          <CardTitle>
            <span className="text-red-600">Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="received" className=" w-4/5 mx-auto">
            <TabsList className="mx-auto mb-4 flex gap-2 bg-transparent p-0">
              <TabsTrigger
                value="received"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 transition"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Received
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 transition"
              >
                <ArrowUpRight className="w-4 h-4" />
                Sent
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
                      className="relative p-5 rounded-xl border border-green-600/30 bg-gradient-to-br from-green-900/50 to-black/60 shadow-md hover:shadow-green-400/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-green-200">
                            +{tx.amount.toLocaleString()} {tx.coin}
                          </p>
                          <p className="text-xs text-gray-200 mt-1">
                            {new Date(tx.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-green-400 uppercase">
                            {tx.status}
                          </span>
                          <span className="mt-1 text-xs text-green-100">
                            Deposit
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 rounded-t-xl animate-pulse opacity-50" />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="sent">
              {sentTransactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No sent transactions yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {sentTransactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="relative p-5 rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-900/50 to-black/60 shadow-md hover:shadow-yellow-400/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-yellow-200">
                            -{tx.amount.toLocaleString()} {tx.coin}
                          </p>
                          <p className="text-xs text-gray-200 mt-1">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;
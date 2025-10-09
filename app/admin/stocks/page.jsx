"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminStocksPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchStocks() {
      setLoading(true);
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setStocks(data.stocks || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to fetch stocks");
      }
      if (mounted) setLoading(false);
    }

    fetchStocks();
    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-4">Fetches a small set of stocks from the server.</p>

            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">Error: {error}</div>}

            {!loading && !error && (
              <div className="space-y-3">
                {stocks.length === 0 && <div className="text-gray-300">No stocks found.</div>}
                {stocks.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between p-3 rounded bg-white/3">
                    <div>
                      <div className="font-semibold">{s.name || s.symbol}</div>
                      <div className="text-xs text-gray-300">{s.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${s.price?.toLocaleString() ?? "0"}</div>
                      <div className={`text-sm ${s.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {s.change ?? 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  Back to Admin
+                </Button>
+              </Link>
+            </div>
+          </CardContent>
+        </Card>
+      </div>
+    </div>
+  );
+}

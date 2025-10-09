"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminStocksPage() {
  const [stocks, setStocks] = useState([]); // pending user stock purchases
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPending() {
      setLoading(true);
      try {
        const res = await fetch("/api/user-stocks");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setStocks(data.stocks || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to fetch pending purchases");
      }
      if (mounted) setLoading(false);
    }

    fetchPending();
    return () => (mounted = false);
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/stocks/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Action failed");

      // remove or update the item locally
      setStocks((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to perform action");
    }
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Stock Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-4">Review and approve or reject user stock purchase requests.</p>

            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">Error: {error}</div>}

            {!loading && !error && (
              <div className="space-y-3">
                {stocks.length === 0 && <div className="text-gray-300">No pending purchases.</div>}
                {stocks.map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-3 rounded bg-white/3">
                    <div>
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-xs text-gray-300">User: {s.user?.username || s.user?.email || 'Unknown'}</div>
                      <div className="text-xs text-gray-300">Shares: {s.shares} • Price: ${s.price}</div>
                      <div className="text-xs text-gray-300">Requested: {new Date(s.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(s._id, 'approve')} disabled={processingId === s._id}>
                        {processingId === s._id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(s._id, 'reject')} disabled={processingId === s._id}>
                        {processingId === s._id ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Link href="/admin">
                <Button variant="ghost" size="sm">Back to Admin</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

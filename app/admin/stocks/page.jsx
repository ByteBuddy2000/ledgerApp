"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminStocksPage() {
  const [stocks, setStocks] = useState([]); // pending user stock purchases
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ id: null, action: null });

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
    // two-step confirm: if not confirmed, set confirmAction and wait for second click
    if (confirmAction.id !== id || confirmAction.action !== action) {
      setConfirmAction({ id, action });
      // reset confirmation after 4s
      setTimeout(() => {
        setConfirmAction({ id: null, action: null });
      }, 4000);
      return;
    }

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
      setConfirmAction({ id: null, action: null });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to perform action");
    }
    setProcessingId(null);
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user-stocks');
      const data = await res.json();
      setStocks(data.stocks || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to refresh');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#350661ff] via-[#000000] to-[#001F3F] text-white py-8">
      <div className="max-w-4xl mx-auto px-4 ">
        <Card className="mb-6 bg-gradient-to-bl from-[#350661ff] via-[#000000] to-[#001F3F]">
          <CardHeader>
            <CardTitle className="text-white">Pending Stock Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-100 mb-4">Review and approve or reject user stock purchase requests.</p>

            {loading && <div className="text-gray-300">Loading...</div>}
            {error && <div className="text-red-400">Error: {error}</div>}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="text-sm text-gray-300">{loading ? 'Loading pending purchases...' : `${stocks.length} pending purchase(s)`}</div>
              <div className="flex items-center gap-2 text-white">
                <button onClick={refresh} className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded hover:bg-white/6">
                  <RefreshCw size={14} /> Refresh
                </button>
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Back</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stocks.length === 0 && !loading && <div className="text-gray-300 col-span-full">No pending purchases.</div>}
                {stocks.map((s) => (
                <Card key={s._id} className="bg-gradient-to-bl from-slate-300/60 to-[#002938] border border-white/6 p-4 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold tracking-tight">{s.symbol}</div>
                          <div className="text-xs text-gray-400 mt-1">{s.user?.username || s.user?.email || 'Unknown'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">Shares</div>
                          <div className="text-xl font-semibold">{s.shares}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="px-2 py-1 bg-white/3 rounded text-xs">Price: ${s.price}</div>
                        <div className={`px-2 py-1 rounded text-xs ${s.status === 'pending' ? 'bg-yellow-500 text-black' : s.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
                          {s.status}
                        </div>
                        <div className="text-xs text-gray-400 ml-auto">{new Date(s.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end items-stretch gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(s._id, 'approve')}
                        disabled={processingId === s._id}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-semibold w-full sm:w-auto ${confirmAction.id === s._id && confirmAction.action === 'approve' ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                      >
                        <Check size={14} />
                        {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'approve' ? 'Confirm' : 'Approve')}
                      </button>

                      <button
                        onClick={() => handleAction(s._id, 'reject')}
                        disabled={processingId === s._id}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-semibold w-full sm:w-auto ${confirmAction.id === s._id && confirmAction.action === 'reject' ? 'bg-red-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                      >
                        <X size={14} />
                        {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'reject' ? 'Confirm' : 'Reject')}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

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

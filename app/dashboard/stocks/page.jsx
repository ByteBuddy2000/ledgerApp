"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, ArrowUpRight, ArrowDownRight, X } from "lucide-react";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalStock, setModalStock] = useState(null);
  const [sharesInput, setSharesInput] = useState(1);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/stocks")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.stocks);
        setLoading(false);
      });
  }, []);

  const handleBuyClick = (stock) => {
    setModalStock(stock);
    setSharesInput(1);
  };

  const handlePay = async () => {
    setPaying(true);
    // Here you would verify payment to the XRP address before allowing purchase
    // For demo, just close modal after 2 seconds
    setTimeout(() => {
      setPaying(false);
      setModalStock(null);
      alert(`Purchased ${sharesInput} shares of ${modalStock.symbol} after XRP payment`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <LineChart className="mx-auto mb-2 text-blue-400" size={40} />
          <h1 className="text-3xl font-bold text-white mb-2">Stocks Marketplace</h1>
          <p className="text-slate-300">
            Buy and track stocks alongside your crypto assets.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-md rounded-2xl animate-pulse border border-white/10 p-6">
                  <div className="h-5 w-24 bg-blue-700/40 rounded mb-4"></div>
                  <div className="h-6 w-36 bg-blue-800/40 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-blue-600/40 rounded"></div>
                </Card>
              ))
            : stocks.map((stock) => {
                const isUp = stock.change > 0;
                const changeColor = isUp ? "text-green-400" : stock.change < 0 ? "text-red-400" : "text-gray-400";
                const changeIcon = isUp ? <ArrowUpRight size={16} /> : stock.change < 0 ? <ArrowDownRight size={16} /> : null;
                return (
                  <Card
                    key={stock.symbol}
                    className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10 backdrop-blur-md p-5 text-white rounded-2xl shadow-lg transition hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                  >
                    <CardHeader className="flex items-center gap-3 p-0 mb-3">
                      <img
                        src={stock.logo}
                        alt={stock.symbol}
                        className="w-10 h-10 object-contain rounded-full border border-white/10 shadow"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/stock-placeholder.png";
                        }}
                      />
                      <div>
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          {stock.symbol}
                        </h4>
                        <p className="text-xs text-blue-300">{stock.name}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-blue-300">
                          Price: ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className={`ml-2 ${changeColor} font-semibold flex items-center gap-1`}>
                          {changeIcon}
                          <span>{stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/70">
                          Owned: <span className="font-bold">-</span> shares
                        </span>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded transition text-xs"
                          onClick={() => handleBuyClick(stock)}
                        >
                          Buy
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>

      {/* Buy Modal */}
      {modalStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalStock(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={modalStock.logo}
                alt={modalStock.symbol}
                className="w-10 h-10 object-contain rounded-full border border-white/10 shadow"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/stock-placeholder.png";
                }}
              />
              <div>
                <h4 className="text-lg font-semibold">{modalStock.symbol}</h4>
                <p className="text-xs text-blue-300">{modalStock.name}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-white mb-2">Select shares to buy:</label>
              <input
                type="number"
                min={1}
                value={sharesInput}
                onChange={e => setSharesInput(Number(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-slate-800 border border-white/20 text-xs text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-white mb-2">Send payment to XRP address:</label>
              <div className="bg-slate-800 text-blue-300 px-3 py-2 rounded font-mono text-xs select-all">
                rEXAMPLEXRPADDRESS1234567890
              </div>
              <p className="text-xs text-gray-400 mt-2">
                After payment, click "Confirm Purchase".
              </p>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition text-base mt-2"
              disabled={paying}
              onClick={handlePay}
            >
              {paying ? "Processing..." : `Confirm Purchase ($${(modalStock.price * sharesInput).toFixed(2)})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
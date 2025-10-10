"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";

const MobileTabs = () => {
  // Simulate unread transaction updates (replace with real logic)
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const res = await fetch("/api/transactions/unread-count");
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.count);
        }
      } catch (err) {
        setUnreadCount(0);
      }
    }
    fetchUnreadCount();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-t from-gray-950 to-gray-900/90 backdrop-blur-md border-t border-gray-700 shadow-inner">
      <div className="relative max-w-4xl mx-auto flex justify-between items-center px-4 py-2 text-[0.75rem] text-gray-300 font-medium">
        <Link
          href="/dashboard/card"
          className="flex flex-col items-center justify-center w-1/5 hover:text-white transition"
        >
          <img src="/icons/credit-card.png" alt="Card" className="w-6 h-6 mb-1" />
          <span>Card</span>
        </Link>

        <Link
          href="/dashboard/connect-wallet"
          className="flex flex-col items-center justify-center w-1/5 hover:text-white transition"
        >
          <img src="/icons/link.png" alt="Connect" className="w-6 h-6 mb-1" />
          <span>Connect</span>
        </Link>

        <Link
          href="/dashboard/"
          className="absolute left-1/2 -top-6 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl border-4 border-gray-900 hover:bg-blue-700 transition"
        >
          <img src="/icons/home.png" alt="Home" className="w-7 h-7" />
        </Link>

        <Link
          href="/dashboard/transactions"
          className="flex flex-col items-center justify-center w-1/5 hover:text-white transition relative"
        >
          <div className="relative">
            <img src="/icons/transaction.png" alt="Transactions" className="w-6 h-6 mb-1" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-[0.7rem] font-bold shadow-lg border-2 border-gray-900 animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <span>Transactions</span>
        </Link>

        <Link
          href="/dashboard/swap-coin"
          className="flex flex-col items-center justify-center w-1/5 hover:text-white transition"
        >
          <img src="/icons/swap.png" alt="Swap" className="w-6 h-6 mb-1" />
          <span>Swap</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileTabs;

"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function BalanceDisplay({ formattedBalance }) {
  const [show, setShow] = useState(true);

  return (
    <div className="my-4 text-center sm:text-left">
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <p className="text-sm text-blue-200">Total Balance  :</p>
        <button
          type="button"
          className="ml-2 text-blue-400 hover:text-blue-600 transition"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide balance" : "Show balance"}
        >
          {show ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mt-2">
        {show ? `$${formattedBalance}` : "••••••••"}
      </h3>
    </div>
  );
}
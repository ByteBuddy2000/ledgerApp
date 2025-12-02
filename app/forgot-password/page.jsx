"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          "If an account exists for that email, a password reset link has been sent."
        );
        setEmail("");
      } else {
        toast.error(data?.error || "Could not process request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/6 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <Mail className="mx-auto mb-2 w-10 h-10 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Forgot password</h2>
          <p className="text-sm text-gray-300 mt-1">
            Enter your email and we'll send a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
              aria-label="Email"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded font-medium text-white ${
              submitting ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
          <Link href="/login" className="underline">
            Back to sign in
          </Link>
          <Link href="/" className="underline">
            Return home
          </Link>
        </div>

       
      </div>
    </div>
  );
}
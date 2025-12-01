"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !id) {
        toast.error("Invalid reset link");
        setValidating(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, id }),
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
        } else {
          toast.error(data.error || "Reset link is invalid or expired");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to validate reset link");
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto mb-4" />
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/6 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Invalid reset link</h2>
          <p className="text-sm text-gray-300 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password" className="text-blue-400 underline">
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/6 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Password reset successful</h2>
          <p className="text-sm text-gray-300 mb-4">
            Your password has been reset. Redirecting to login...
          </p>
          <Link href="/login" className="text-blue-400 underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/6 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <Lock className="mx-auto mb-2 w-10 h-10 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Reset your password</h2>
          <p className="text-sm text-gray-300 mt-1">Enter a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">New password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded font-medium text-white ${
              submitting ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-400 underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

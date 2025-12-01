"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-semibold mb-4">Reset Password</h1>

        {!token ? (
          <p className="text-red-500">Invalid or missing token.</p>
        ) : (
          <>
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Reset Password"}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-gray-300">
                {message}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}

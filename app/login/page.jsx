"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // <-- Sonner toast

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      remember,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/qfslogo.png" alt="Logo" className="mx-auto h-12" />
          <h2 className="mt-2 text-lg font-medium text-gray-700">
            Login to your Account
          </h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded bg-blue-100 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded bg-blue-100 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
            <div className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                id="remember"
              />
              <label htmlFor="remember">Remember this account</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-bold rounded transition duration-200 ${
                loading ? "bg-gray-700" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "SIGN IN"
              )}
            </button>
          </div>

          <div className="text-sm mt-4 flex justify-between text-blue-600">
            <a href="#">Forgot Password?</a>
            <a href="/register">Create Account</a>
          </div>
          {/* Back to Home Page */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-gray-600 hover:text-black font-medium underline transition"
            >
              ← Back to Home Page
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

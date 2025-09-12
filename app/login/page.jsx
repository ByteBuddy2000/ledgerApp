"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // <-- Add icons

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- State for password visibility

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded bg-blue-100 focus:outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

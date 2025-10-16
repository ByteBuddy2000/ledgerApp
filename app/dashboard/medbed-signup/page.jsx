"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MedbedSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fee = 10000; // registration fee in USD

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/medbed/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, fee }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Registration successful. We will contact you soon.");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Medbed Registration</h1>
        <p className="text-sm text-gray-300 mb-4">Please provide your details and pay the registration fee of <strong>${fee.toLocaleString()}</strong>.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full name</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone number</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Home address</label>
            <textarea className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">Registration fee</span>
              <div className="text-lg font-semibold">${fee.toLocaleString()}</div>
            </div>
            <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold">
              {submitting ? "Submitting..." : "Submit & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

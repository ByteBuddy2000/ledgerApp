"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2 } from "lucide-react";

export default function MedbedSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("white");
  const [submitting, setSubmitting] = useState(false);
  const [color, setColor] = useState("white");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [step, setStep] = useState(1);
  const [copyStatus, setCopyStatus] = useState("");

  const fee = 10000; // registration fee in USD

  useEffect(() => {
    async function loadPaymentMethod() {
      try {
        const response = await fetch("/api/payment-methods?purpose=medbed");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load payment method.");
        setPaymentMethod(data.methods?.[0] || null);
      } catch {
        setPaymentMethod(null);
      } finally {
        setLoadingPaymentMethod(false);
      }
    }
    loadPaymentMethod();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/medbed/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, color }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPaymentInfo({
          registrationId: data.registrationId,
          amountXrp: data.amountXrp,
          receiverAddress: data.receiverAddress,
          paymentMethodName: data.paymentMethodName,
          paymentNetwork: data.paymentNetwork,
          paymentInstructions: data.paymentInstructions,
        });
        setStep(2);
        toast.success("Registration saved. Complete XRP payment to finish.");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!txHash) {
      toast.error("Please enter the transaction hash.");
      return;
    }
    setConfirming(true);

    try {
      const response = await fetch("/api/medbed/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: paymentInfo.registrationId, txHash }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStep(3);
        toast.success("Payment confirmed successfully.");
        setTimeout(() => router.push("/dashboard"), 1400);
      } else {
        toast.error(result.error || "Confirmation failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const formatStatus = (s) => {
    if (s === "pending_payment") return "Pending payment";
    if (s === "paid") return "Paid";
    if (s === "cancelled") return "Cancelled";
    return s;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-300">Medbed Registration</h1>
            <p className="mt-2 text-gray-300">Secure a medbed slot with XRP payment and confirm with transaction hash.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {["Register", "Pay", "Confirm"].map((label, idx) => {
              const current = idx + 1;
              return (
                <div key={label} className="flex-1">
                  <div
                    className={`w-full rounded-xl border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
                      step === current
                        ? "bg-blue-600 border-blue-500 text-white"
                        : step > current
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-200"
                        : "bg-slate-800 border-slate-700 text-gray-400"
                    }`}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full name" value={name} onChange={(v) => setName(v)} />
                <InputField label="Phone" value={phone} onChange={(v) => setPhone(v)} type="tel" />
                <InputField label="Email" value={email} onChange={(v) => setEmail(v)} type="email" />
                <SelectField label="Bed color" value={color} onChange={(v) => setColor(v)} options={["white", "black", "silver", "gold", "blue"]} />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Home address</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g. 123 Main Street, City, Country"
                  required
                />
              </div>

              <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-sm flex items-center justify-between">
                <span>Registration fee</span>
                <strong className="text-blue-300">${fee.toLocaleString()} USD</strong>
              </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">Registration fee</span>
              <div className="text-lg font-semibold">${fee.toLocaleString()}</div>
            </div>
            <button type="submit" disabled={submitting || loadingPaymentMethod || !paymentMethod} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? "Submitting..." : loadingPaymentMethod ? "Loading payment..." : !paymentMethod ? "Payment unavailable" : "Submit & Pay"}
            </button>
          </div>
        </form>

        {/* If there's payment info returned, show payment instructions and a confirm form */}
        {paymentInfo && (
          <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
            <h2 className="text-lg font-semibold mb-2">Payment details</h2>
            <p className="text-sm text-gray-300">Send <strong>{paymentInfo.amountXrp} XRP</strong> using {paymentInfo.paymentMethodName}{paymentInfo.paymentNetwork ? ` (${paymentInfo.paymentNetwork})` : ""} to:</p>
            <div className="break-words bg-gray-900 p-2 rounded my-2">{paymentInfo.receiverAddress || "(No receiver address configured)"}</div>
            {paymentInfo.paymentInstructions && <p className="mb-2 text-sm text-gray-300 whitespace-pre-wrap">{paymentInfo.paymentInstructions}</p>}
            <p className="text-xs text-gray-400 mb-2">After you send the payment, paste the transaction hash below and click Confirm.</p>

            <div className="space-y-2">
              <input placeholder="Transaction hash (txHash)" value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
              <div className="flex justify-end">
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60"
                >
                  {confirming ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</span>
                  ) : (
                    "Confirm payment"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-5 rounded-xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Payment confirmed!</p>
                  <p className="text-sm text-gray-200">We received your transaction hash and your request is now marked as paid.</p>
                </div>
              </div>
            </div>
          )}

        {!paymentInfo && loadingPaymentMethod && <div className="mt-4 text-sm text-gray-400">Loading payment method...</div>}
        {!paymentInfo && !loadingPaymentMethod && paymentMethod && (
          <div className="mt-4 text-sm text-gray-400">
            Payment will be sent to {paymentMethod.name}{paymentMethod.network ? ` (${paymentMethod.network})` : ""}: <span className="break-words text-gray-200">{paymentMethod.destination}</span>
            {paymentMethod.instructions && <p className="mt-2 whitespace-pre-wrap">{paymentMethod.instructions}</p>}
          </div>
        )}
        {!paymentInfo && !loadingPaymentMethod && !paymentMethod && <p className="mt-4 text-sm text-amber-300">Payment is temporarily unavailable. Please contact support.</p>}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
        required
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-white">
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}

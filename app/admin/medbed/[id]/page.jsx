"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, CheckCircle, XCircle, CircleDot } from "lucide-react";

export default function MedbedDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchRegistration = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/medbed/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistration(data.registration);
      } else {
        toast.error(data.error || "Failed to load details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!confirm(`Are you sure you want to ${action} this registration?`)) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/medbed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Registration ${action}ed successfully`);
        setRegistration(data.registration);
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300">
        <Loader2 className="w-12 h-12 animate-spin" />
        <span className="ml-3">Loading details…</span>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 p-6">
        <div className="mx-auto max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
          <p>No registration found.</p>
          <button
            onClick={() => router.push("/admin/medbed")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 text-white">
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-gray-300 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-300">Registration Details</h1>
              <p className="text-sm text-gray-400">ID: {registration._id}</p>
            </div>
            <div className="inline-flex items-center gap-2">
              <StatusBadge status={registration.status} />
              <StatusBadge status={registration.adminApproved ? "approved" : "not-approved"} label="Admin" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info label="Name" value={registration.name} />
            <Info label="Email" value={registration.email} />
            <Info label="Phone" value={registration.phone} />
            <Info label="Bed color" value={registration.color} />
            <Info label="Amount (XRP)" value={registration.amountXrp ?? "-"} />
            <Info label="Date" value={new Date(registration.createdAt).toLocaleString()} />
            <Info label="Address" value={registration.address} />
            <Info label="TX Hash" value={registration.txHash || "--"} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ActionButton onClick={() => handleAction("approve")} processing={processing} color="emerald">
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </ActionButton>
            <ActionButton onClick={() => handleAction("reject")} processing={processing} color="rose">
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-[#12162f] p-3">
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className="mt-1 break-words text-base font-semibold text-white">{value || "-"}</p>
    </div>
  );
}

function StatusBadge({ status, label }) {
  const map = {
    paid: "bg-emerald-500/20 text-emerald-200 border border-emerald-400",
    pending_payment: "bg-amber-500/20 text-amber-200 border border-amber-400",
    cancelled: "bg-rose-500/20 text-rose-200 border border-rose-400",
    approved: "bg-emerald-500/20 text-emerald-200 border border-emerald-400",
    "not-approved": "bg-slate-700 text-slate-300 border border-slate-600",
  };
  return (
    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || map["not-approved"]}`}>
      {label ? label : status.replace("_", " ")}
    </div>
  );
}

function ActionButton({ children, onClick, processing, color }) {
  const classNames = {
    emerald: "bg-emerald-600 hover:bg-emerald-500",
    rose: "bg-rose-600 hover:bg-rose-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={processing}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white ${classNames[color]} disabled:opacity-50`}
    >
      {processing ? <span className="flex items-center gap-2">...Processing</span> : children}
    </button>
  );
}

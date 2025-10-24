"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bed } from "lucide-react";

export default function AdminMedbedPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRegs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/medbed");
      const data = await res.json();
      if (res.ok) {
        setRegistrations(data.registrations || []);
      } else {
        toast.error(data.error || "Failed to load registrations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegs();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this registration?`)) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/medbed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`${action === "approve" ? "Approved" : "Rejected"}.`);
        // update local list
        setRegistrations((prev) => prev.map((r) => (r._id === id ? data.registration : r)));
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bed className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Medbed Registrations</h1>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : registrations.length === 0 ? (
        <div className="text-muted">No registrations found.</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Color</th>
                <th className="p-2">Amount (XRP)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Admin Approved</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.phone}</td>
                  <td className="p-2">{r.color}</td>
                  <td className="p-2">{r.amountXrp ?? "-"}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.adminApproved ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        disabled={processingId === r._id}
                        onClick={() => handleAction(r._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
                      >
                        {processingId === r._id ? "..." : "Approve"}
                      </button>
                      <button
                        disabled={processingId === r._id}
                        onClick={() => handleAction(r._1d, "reject")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                      >
                        {processingId === r._id ? "..." : "Reject"}
                      </button>
                      <button
                        onClick={() => {
                          router.push(`/admin/medbed/${r._id}`);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
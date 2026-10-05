"use client";

import { useEffect, useState } from "react";
import AdminTopNav from "../_components/AdminTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const emptyForm = {
  purpose: "asset",
  methodType: "crypto",
  name: "",
  asset: "",
  network: "",
  destination: "",
  instructions: "",
  enabled: true,
  sortOrder: 0,
};

const purposes = [
  { value: "asset", label: "Asset deposits" },
  { value: "card", label: "Card deposits" },
  { value: "deposit", label: "Dashboard deposits" },
  { value: "stocks", label: "Stock purchases" },
  { value: "401k", label: "401(k) contributions" },
  { value: "medbed", label: "Medbed payments" },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payment-methods");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load payment methods.");
      setMethods(data.methods || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/payment-methods", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save payment method.");
      toast.success(editingId ? "Payment method updated." : "Payment method added.");
      resetForm();
      await loadMethods();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editMethod = (method) => {
    setEditingId(method._id);
    setForm({
      purpose: method.purpose,
      methodType: method.methodType,
      name: method.name,
      asset: method.asset || "",
      network: method.network || "",
      destination: method.destination,
      instructions: method.instructions || "",
      enabled: method.enabled,
      sortOrder: method.sortOrder || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMethod = async (method) => {
    if (!window.confirm(`Delete "${method.name}"?`)) return;
    try {
      const response = await fetch("/api/admin/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: method._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete payment method.");
      if (editingId === method._id) resetForm();
      toast.success("Payment method deleted.");
      await loadMethods();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <AdminTopNav />
        <h2 className="mb-6 text-2xl font-semibold">Payment methods</h2>

        <form onSubmit={handleSubmit} className="mb-10 grid gap-5 border border-gray-800 bg-gray-900 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h3 className="text-lg font-medium">{editingId ? "Edit method" : "Add method"}</h3>
            <p className="mt-1 text-sm text-gray-400">Only enter payment details intended to be shown publicly. Never enter wallet recovery phrases or private keys.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Shown for</Label>
            <select id="purpose" name="purpose" value={form.purpose} onChange={updateField} className="h-10 w-full rounded border border-gray-700 bg-gray-950 px-3 text-sm">
              {purposes.map((purpose) => <option key={purpose.value} value={purpose.value}>{purpose.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="methodType">Method type</Label>
            <select id="methodType" name="methodType" value={form.methodType} onChange={updateField} className="h-10 w-full rounded border border-gray-700 bg-gray-950 px-3 text-sm">
              <option value="crypto">Cryptocurrency</option>
              <option value="bank">Bank transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" name="name" value={form.name} onChange={updateField} placeholder="USDT (TRC20)" required maxLength={80} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset / currency</Label>
              <Input id="asset" name="asset" value={form.asset} onChange={updateField} placeholder="USDT" maxLength={20} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Input id="network" name="network" value={form.network} onChange={updateField} placeholder="TRC20" maxLength={60} />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="destination">Public destination or payment details</Label>
            <Textarea id="destination" name="destination" value={form.destination} onChange={updateField} required maxLength={2000} rows={3} placeholder="Wallet address, merchant payment link, or public bank transfer instructions" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="instructions">User instructions</Label>
            <Textarea id="instructions" name="instructions" value={form.instructions} onChange={updateField} maxLength={2000} rows={2} placeholder="Optional network, memo, reference, or transfer instructions" />
          </div>
          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" name="enabled" checked={form.enabled} onChange={updateField} className="size-4 accent-green-500" />
              Show to users
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Label htmlFor="sortOrder">Display order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" value={form.sortOrder} onChange={updateField} className="w-24" />
            </div>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add payment method"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>

        <section aria-labelledby="configured-methods">
          <h3 id="configured-methods" className="mb-3 text-lg font-medium">Configured methods</h3>
          {loading ? <p className="text-sm text-gray-400">Loading payment methods...</p> : methods.length === 0 ? (
            <p className="border border-gray-800 p-5 text-sm text-gray-400">No payment methods configured.</p>
          ) : (
            <div className="divide-y divide-gray-800 border-y border-gray-800">
              {methods.map((method) => (
                <article key={method._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{method.name}</h4>
                      <span className="text-xs uppercase text-gray-400">{method.purpose}</span>
                      <span className={`text-xs ${method.enabled ? "text-green-400" : "text-gray-500"}`}>{method.enabled ? "Shown" : "Hidden"}</span>
                    </div>
                    {(method.asset || method.network) && <p className="mt-1 text-sm text-gray-400">{[method.asset, method.network].filter(Boolean).join(" · ")}</p>}
                    <p className="mt-2 whitespace-pre-wrap break-words font-mono text-sm text-gray-300">{method.destination}</p>
                    {method.instructions && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-400">{method.instructions}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => editMethod(method)}>Edit</Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => deleteMethod(method)}>Delete</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  CreditCard,
  AlertTriangle,
  DollarSign,
  Activity,
  UserPlus,
  List,                                         
  Shield,     
  BarChart3,
  BetweenVerticalStart,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import AdminTopNav from "./_components/AdminTopNav";
import { useRef, useEffect, useState } from "react";

// const stats = [
//   {
//     title: "Total Customers",
//     value: "12,345",
//     change: "+12%",
//     icon: Users,
//     color: "text-blue-600",
//   },
//   {
//     title: "Active Accounts",
//     value: "9,876",
//     change: "+8%",
//     icon: CreditCard,
//     color: "text-green-600",
//   },
//   {
//     title: "Total Volume",
//     value: "$2.4M",
//     change: "+23%",
//     icon: DollarSign,
//     color: "text-purple-600",
//   },
//   {
//     title: "Pending KYC",
//     value: "156",
//     change: "-5%",
//     icon: AlertTriangle,
//     color: "text-orange-600",
//   },
// ];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Account Created",
    time: "2 minutes ago",
    status: "success",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "KYC Approved",
    time: "5 minutes ago",
    status: "success",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Large Transaction",
    time: "10 minutes ago",
    status: "warning",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "KYC Rejected",
    time: "15 minutes ago",
    status: "error",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    user: "David Chen",
    action: "Password Reset",
    time: "20 minutes ago",
    status: "info",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  
];

const kycQueue = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex@example.com",
    submitted: "2 hours ago",
    status: "pending",
    documents: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    submitted: "4 hours ago",
    status: "review",
    documents: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Chen",
    email: "david@example.com",
    submitted: "6 hours ago",
    status: "pending",
    documents: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function AdminDashboard({ recentCustomers = [] }) {
  // Pending withdrawals state
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  // For notification badge
  const [pendingWithdrawalCount, setPendingWithdrawalCount] = useState(0);

  // Ref for scrolling to section
  const withdrawalSectionRef = useRef(null);

  useEffect(() => {
    async function fetchPendingWithdrawals() {
      setLoadingWithdrawals(true);
      try {
        const res = await fetch("/api/admin/withdrawals");
        const data = await res.json();
        if (data.success) {
          setPendingWithdrawals(data.withdrawals || []);
          setPendingWithdrawalCount((data.withdrawals || []).length);
        }
      } catch (err) {}
      setLoadingWithdrawals(false);
    }
    fetchPendingWithdrawals();
  }, []);

  // Scroll to withdrawal section
  const handleGoToWithdrawals = () => {
    withdrawalSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Approve handler
  const [processingWithdrawalId, setProcessingWithdrawalId] = useState(null);

  const handleApprove = async (withdrawalId) => {
    setProcessingWithdrawalId(withdrawalId);
    await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, { method: "POST" });
    setPendingWithdrawals((prev) => prev.filter(w => w._id !== withdrawalId));
    setPendingWithdrawalCount((prev) => Math.max(prev - 1, 0));
    setProcessingWithdrawalId(null);
  };

  // Decline handler
  const handleDecline = async (withdrawalId) => {
    setProcessingWithdrawalId(withdrawalId);
    await fetch(`/api/admin/withdrawals/${withdrawalId}/reject`, { method: "POST" });
    setPendingWithdrawals((prev) => prev.filter(w => w._id !== withdrawalId));
    setPendingWithdrawalCount((prev) => Math.max(prev - 1, 0));
    setProcessingWithdrawalId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Top Navigation */}
        <AdminTopNav />

        {/* Welcome */}
        <div className="mb-8 mt-4">
          <p className="text-gray-400 text-sm mt-1">
            Manage users, monitor activity, and reviews for your platform.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Stats + Actions) */}
          <div className=" lg:col-span-2 space-y-6">
            {/* Stats */}
            {/* <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.title}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start"
                  >
                    <div className={`mb-2 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-lg font-semibold">{stat.title}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div
                      className={`text-xs mt-1 ${stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                        }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-md">
              <h2 className="text-lg font-semibold mb-3 text-white">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Show/hide with boolean flags */}
                {true && (
                  <Link href="/admin/seed">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:bg-white/10 transition text-white cursor-pointer">
                      <UserPlus className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">View Data</span>
                    </div>
                  </Link>
                )}
                {true && (
                  <Link href="/admin/customers">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:bg-white/10 transition text-white cursor-pointer">
                      <List className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Customer List</span>
                    </div>
                  </Link>
                )}
                {true && (
                  <Link href="/admin/wallet">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:bg-white/10 transition text-white cursor-pointer">
                     <BetweenVerticalStart className="w-6 h-6 mb-2"  />
                      <span className="text-sm font-medium">Top-Up Assets</span>
                    </div>
                  </Link>
                )}
                {false && (
                  <Link href="/admin/kyc">
                    <div className="hidden bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex-col items-center justify-center hover:bg-white/10 transition text-white cursor-pointer">
                      <Shield className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Review KYC</span>
                    </div>
                  </Link>
                )}
                {false && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:bg-white/10 transition text-white cursor-pointer">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                )}
                <button
                  onClick={handleGoToWithdrawals}
                  className="relative bg-white/5 border border-yellow-400/30 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:bg-yellow-900/20 transition text-yellow-200 cursor-pointer"
                >
                  <DollarSign className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Pending Withdrawals</span>
                  {pendingWithdrawalCount > 0 && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-0.5 shadow">
                      {pendingWithdrawalCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Pending Withdrawals Section */}
            <div
              ref={withdrawalSectionRef}
              className="bg-white/5 border border-yellow-400/20 rounded-2xl p-5 shadow-lg backdrop-blur-md mt-8"
            >
              <h2 className="text-lg font-semibold mb-3 text-yellow-300 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                Pending Withdrawals
                {pendingWithdrawalCount > 0 && (
                  <span className="ml-2 bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-0.5 shadow">
                    {pendingWithdrawalCount}
                  </span>
                )}
              </h2>
              {loadingWithdrawals ? (
                <div className="text-yellow-200 py-8 text-center">Loading...</div>
              ) : pendingWithdrawals.length === 0 ? (
                <div className="text-yellow-200 py-8 text-center">No pending withdrawals.</div>
              ) : (
                <div className="space-y-4">
                  {pendingWithdrawals.map((w) => (
                    <div
                      key={w._id}
                      className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-900/40 to-black/60 shadow-md"
                    >
                      {/* Loading overlay */}
                      {processingWithdrawalId === w._id && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-xl">
                          <Loader2 className="animate-spin w-8 h-8 text-yellow-400" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={w.user?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {w.user?.username
                              ? w.user.username.split(" ").map((n) => n[0]).join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-yellow-100">{w.user?.username || "Unknown User"}</div>
                          <div className="text-xs text-yellow-200">{w.user?.email}</div>
                          <div className="text-xs text-yellow-300 mt-1">
                            {w.coin} ({w.network})
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div>
                          <span className="font-bold text-yellow-200 text-lg">
                            {w.amount.toLocaleString()} {w.coin}
                          </span>
                          <div className="text-xs text-yellow-100 mt-1">
                            Wallet: <span className="font-mono">{w.walletAddress}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(w._id)}
                            disabled={processingWithdrawalId === w._id}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDecline(w._id)}
                            disabled={processingWithdrawalId === w._id}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-300 text-right mt-2 md:mt-0">
                        Requested: {new Date(w.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="hidden bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                  >
                    <Avatar>
                      <AvatarImage src={item.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {item.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          item.status === "success"
                            ? "default"
                            : item.status === "warning"
                              ? "secondary"
                              : item.status === "error"
                                ? "destructive"
                                : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Recent Customers + KYC Queue) */}
          <div className="hidden space-y-6">
            {/* Recent Customers */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Recent Customers</h2>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                  >
                    <Avatar>
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {customer.username
                          ? customer.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{customer.username}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {customer.joinDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={customer.type === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {customer.type}
                      </Badge>
                      <p className="text-xs font-medium mt-1">{customer.balance}</p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/customers">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Customers
                  </Button>
                </Link>
              </div>
            </div>

            {/* KYC Queue */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-3">KYC Review Queue</h2>
              <div className="space-y-4">
                {kycQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={item.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.documents} docs • {item.submitted}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={item.status === "pending" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/admin/kyc">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Pending
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import AdminTopNav from "../_components/AdminTopNav"

const stats = [
  { label: "Total Customers", value: "12,345", color: "text-blue-600" },
  { label: "Active", value: "9,876", color: "text-green-600" },
  { label: "Inactive", value: "1,234", color: "text-yellow-600" },
  { label: "Suspended", value: "235", color: "text-red-600" },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")
  const [loadingUserId, setLoadingUserId] = useState(null)
  const [loadingRoleUserId, setLoadingRoleUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      const res = await fetch("/api/admin/customers")
      const data = await res.json()
      setCustomers(data.customers || [])
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  const handleToggle = async (userId) => {
    setLoadingUserId(userId)
    try {
      const res = await fetch("/api/admin/toggle-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? {
                ...user,
                isActive: data.status === "active",
                status: data.status,
              }
              : user
          )
        )
      }
    } catch (err) {
      console.error("Error toggling user:", err)
    } finally {
      setLoadingUserId(null)
    }
  }

  const handleToggleRole = async (userId) => {
    setLoadingRoleUserId(userId)
    try {
      const res = await fetch("/api/admin/toggle-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: data.role } : user
          )
        )
      }
    } catch (err) {
      console.error("Error toggling role:", err)
    } finally {
      setLoadingRoleUserId(null)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const username = customer.username || ""
    const email = customer.email || ""
    const phone = customer.phone || ""
    const firstName = customer.firstName || ""
    const lastName = customer.lastName || ""
    const country = customer.country || ""
    const state = customer.state || ""
    const zipCode = customer.zipCode || ""

    const matchesSearch =
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zipCode.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter
    const matchesKyc =
      kycFilter === "all" || customer.kycStatus === kycFilter

    return matchesSearch && matchesStatus && matchesKyc
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getKycStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <AdminTopNav />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className=" text-gray-400">
              Manage and monitor all customer accounts
            </p>
          </div>
        </motion.div>

        {/* Loading Screen */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
            <p className="text-lg text-yellow-200">Loading customers...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex gap-2 text-gray-900">
                {/* Status filter */}
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                      Suspended
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* KYC filter */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      KYC: {kycFilter === "all" ? "All" : kycFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setKycFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setKycFilter("verified")}>
                      Verified
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setKycFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setKycFilter("rejected")}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>

            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-800">
                        <tr className="text-left">
                          <th className="p-4 font-medium">Username</th>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Contact</th>
                          <th className="p-4 font-medium">Country</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="hidden p-4 font-medium">KYC</th>
                          <th className="p-4 font-medium">Balance</th>
                          <th className="hidden p-4 font-medium">Account Type</th>
                          <th className="hidden p-4 font-medium">Last Login</th>
                          <th className="p-4 font-medium">Role</th>

                          {/* <th className="p-4 font-medium">Wallets</th>
                          <th className="p-4 font-medium">Assets</th> */}
                          <th className="p-4 font-medium">Status Switch</th>
                          <th className="hidden p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-black">
                                    {(customer.username || "NA")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{customer.username || "No Name"}</p>
                                  <p className="hidden text-sm text-gray-400">
                                    ID: {customer.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <span>{customer.firstName} {customer.lastName}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  {customer.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {customer.phone}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span>{customer.country}</span>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(customer.status)}>
                                {customer.status}
                              </Badge>
                            </td>
                            <td className="hidden p-4">
                              <Badge className={getKycStatusColor(customer.kycStatus)}>
                                {customer.kycStatus}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{customer.balance}</p>
                            </td>
                            <td className="hidden p-4">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                {customer.accountType}
                              </div>
                            </td>
                            <td className="hidden p-4">
                              <p className="text-sm">{customer.lastLogin}</p>
                            </td>
                            <td className="p-4">
                              {loadingRoleUserId === customer.id ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={customer.role === "admin"}
                                    onCheckedChange={() => handleToggleRole(customer.id)}
                                    className={`${customer.role === "admin" ? "bg-blue-600" : "bg-gray-400"
                                      } border rounded-full`}
                                  />
                                  <span className="text-sm text-gray-300">
                                    {customer.role === "admin" ? "Admin" : "User"}
                                  </span>
                                </div>
                              )}
                            </td>

                           
                            <td className="p-4">
                              {loadingUserId === customer.id ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                              ) : (
                                <Switch
                                  checked={customer.isActive}
                                  onCheckedChange={() => handleToggle(customer.id)}
                                  className={`${customer.isActive ? "bg-green-500" : "bg-gray-300"
                                    } border rounded-full`}
                                />
                              )}
                            </td>
                            <td className="hidden p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Customer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Manage Accounts
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
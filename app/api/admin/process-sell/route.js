import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";

export async function POST(req) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.isAdmin && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, action, approvedShares } = body;
    if (!id || !action) {
      return NextResponse.json({ success: false, error: "Missing id or action" }, { status: 400 });
    }

    const stock = await UserStock.findById(id);
    if (!stock) {
      return NextResponse.json({ success: false, error: "Sell request not found" }, { status: 404 });
    }

    if (action === "reject") {
      stock.status = "sell-rejected";
      await stock.save();
      const out = await UserStock.findById(id).populate("user", "username email avatar").lean();
      return NextResponse.json({ success: true, stock: out });
    }

  if (action === "approve") {
  const remaining = Math.max(0, (stock.shares || 0) - (stock.processedShares || 0));
  const toProcess =
    Math.min(
      remaining,
      Number.isFinite(Number(approvedShares)) && Number(approvedShares) > 0
        ? Number(approvedShares)
        : remaining
    );

  if (toProcess <= 0) {
    return NextResponse.json({ success: false, error: "No shares available to process" }, { status: 400 });
  }

  // Update processedShares + status on the sell request
  stock.processedShares = (stock.processedShares || 0) + toProcess;
  stock.status = stock.processedShares >= stock.shares ? "sold" : "partial-sold";
  await stock.save();

  // If all shares are sold, remove the stock record entirely
  if (stock.status === "sold") {
    await UserStock.findByIdAndDelete(stock._id);
  }

  const updated = await UserStock.findById(id)
    .populate("user", "username email avatar")
    .lean();

  return NextResponse.json({
    success: true,
    stock: updated,
    deducted: toProcess,
    message: "Sell approved and shares reduced successfully",
  });
}


    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/admin/process-sell error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
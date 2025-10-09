import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectToDB();
    // Return pending user stock purchases
    const stocks = await UserStock.find({ status: "pending" }).populate("user", "username email").lean();
    return NextResponse.json({ success: true, stocks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";

export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { id, shares } = body;
    if (!id || !shares || shares < 1) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    const stock = await UserStock.findById(id);
    if (!stock) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    stock.shares += shares;
    await stock.save();
    return NextResponse.json({ success: true, stock });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}

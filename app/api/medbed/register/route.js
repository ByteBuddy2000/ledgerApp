import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, fee } = body;

    if (!name || !phone || !email || !address) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // For now just validate the fee equals expected amount
    if (Number(fee) !== 10000) {
      return NextResponse.json({ success: false, error: "Invalid registration fee" }, { status: 400 });
    }

    // TODO: integrate payment processing and persistent storage

    // Return success for now
    return NextResponse.json({ success: true, message: "Registered" });
  } catch (err) {
    console.error("/api/medbed/register error", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}

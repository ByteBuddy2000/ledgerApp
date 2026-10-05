import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import MedbedRegistration from "@/models/MedbedRegistration";

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationId, txHash } = body;

    if (!registrationId || !txHash) {
      return NextResponse.json({ success: false, error: "Missing registrationId or txHash" }, { status: 400 });
    }

    await connectToDB();

    const reg = await MedbedRegistration.findById(registrationId);
    if (!reg) return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    if (reg.status === "paid") {
      return NextResponse.json({ success: false, error: "Payment has already been verified." }, { status: 409 });
    }

    // A submitted hash is a claim only; an admin must verify it before marking payment paid.
    reg.status = "pending_payment";
    reg.txHash = txHash.trim();
    await reg.save();

    return NextResponse.json({ success: true, message: "Transaction submitted for verification." });
  } catch (err) {
    console.error("/api/medbed/confirm error", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}

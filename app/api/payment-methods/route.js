import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import PaymentMethod from "@/models/PaymentMethod";

const purposes = ["asset", "card", "deposit", "stocks", "401k", "medbed"];

export async function GET(request) {
  const purpose = request.nextUrl.searchParams.get("purpose");
  if (!purpose || !purposes.includes(purpose)) {
    return NextResponse.json({ error: "A valid purpose is required." }, { status: 400 });
  }

  try {
    await connectToDB();
    const methods = await PaymentMethod.find({ purpose, enabled: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return NextResponse.json({ methods });
  } catch (error) {
    console.error("GET /api/payment-methods error:", error);
    return NextResponse.json({ error: "Unable to load payment methods." }, { status: 500 });
  }
}
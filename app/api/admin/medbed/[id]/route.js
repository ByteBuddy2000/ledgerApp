import { NextResponse } from "next/server";
// use relative imports to avoid path-alias issues in route handlers
import { connectToDB } from "@/lib/connectDB";
import MedbedRegistration from "@/models/MedbedRegistration";

export async function GET(req, context) {
  try {
    // context must be awaited before accessing params (Next.js requirement)
    const { params } = await context;

    await connectToDB();
    const reg = await MedbedRegistration.findById(params.id);
    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, registration: reg }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/medbed/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

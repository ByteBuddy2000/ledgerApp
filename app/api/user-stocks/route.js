
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";
import User from "@/models/User";


export async function GET(request) {
  try {
    await connectToDB();
    const url = new URL(request.url);
  const approved = url.searchParams.get("approved");
  const all = url.searchParams.get("all");

    if (approved === "true" || all === "true") {
      // Return stocks for the current user
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      let query = { user: user._id };
      if (approved === "true") query.status = "approved";
      // If all=true, return all statuses
      const stocks = await UserStock.find(query).lean();
      return NextResponse.json({ success: true, stocks });
    } else {
      // Return pending user stock purchases (admin view)
      const stocks = await UserStock.find({ status: "pending" }).populate("user", "username email").lean();
      return NextResponse.json({ success: true, stocks });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}

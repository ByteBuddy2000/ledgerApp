import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import PaymentMethod from "@/models/PaymentMethod";

const purposes = ["asset", "card", "deposit", "stocks", "401k", "medbed"];
const methodTypes = ["crypto", "bank", "other"];

async function authorizeAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { status: 401 };
  if (session.user.role !== "admin") return { status: 403 };
  return null;
}

function validMethod(method) {
  return Boolean(
    method &&
    purposes.includes(method.purpose) &&
    methodTypes.includes(method.methodType) &&
    typeof method.name === "string" && method.name.trim() &&
    typeof method.destination === "string" && method.destination.trim() &&
    (!["asset", "401k"].includes(method.purpose) || (typeof method.asset === "string" && method.asset.trim())) &&
    (method.purpose !== "medbed" || (method.methodType === "crypto" && method.asset?.toUpperCase() === "XRP"))
  );
}

function normalizeMethod(body) {
  return {
    purpose: body.purpose,
    methodType: body.methodType,
    name: body.name.trim(),
    asset: typeof body.asset === "string" ? body.asset.trim().toUpperCase() : "",
    network: typeof body.network === "string" ? body.network.trim() : "",
    destination: body.destination.trim(),
    instructions: typeof body.instructions === "string" ? body.instructions.trim() : "",
    enabled: body.enabled !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

function unauthorized(access) {
  return NextResponse.json({ error: "Unauthorized" }, { status: access.status });
}

export async function GET() {
  try {
    const access = await authorizeAdmin();
    if (access) return unauthorized(access);

    await connectToDB();
    const methods = await PaymentMethod.find().sort({ purpose: 1, sortOrder: 1, name: 1 }).lean();
    return NextResponse.json({ methods });
  } catch (error) {
    console.error("GET /api/admin/payment-methods error:", error);
    return NextResponse.json({ error: "Unable to load payment methods." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const access = await authorizeAdmin();
    if (access) return unauthorized(access);

    const body = await request.json();
    if (!validMethod(body)) {
      return NextResponse.json({ error: "Name, purpose, type, and destination are required." }, { status: 400 });
    }

    await connectToDB();
    const method = await PaymentMethod.create(normalizeMethod(body));
    return NextResponse.json({ method }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/payment-methods error:", error);
    return NextResponse.json({ error: "Unable to save payment method." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const access = await authorizeAdmin();
    if (access) return unauthorized(access);

    const body = await request.json();
    if (!body.id || !validMethod(body)) {
      return NextResponse.json({ error: "A valid method ID and all required fields are needed." }, { status: 400 });
    }

    await connectToDB();
    const method = await PaymentMethod.findByIdAndUpdate(
      body.id,
      normalizeMethod(body),
      { new: true, runValidators: true }
    );
    if (!method) return NextResponse.json({ error: "Payment method not found." }, { status: 404 });
    return NextResponse.json({ method });
  } catch (error) {
    console.error("PUT /api/admin/payment-methods error:", error);
    return NextResponse.json({ error: "Unable to update payment method." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const access = await authorizeAdmin();
    if (access) return unauthorized(access);

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "A payment method ID is required." }, { status: 400 });

    await connectToDB();
    const method = await PaymentMethod.findByIdAndDelete(id);
    if (!method) return NextResponse.json({ error: "Payment method not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/payment-methods error:", error);
    return NextResponse.json({ error: "Unable to delete payment method." }, { status: 500 });
  }
}

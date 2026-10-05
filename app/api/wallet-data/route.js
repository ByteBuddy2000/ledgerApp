export async function GET() {
  return Response.json(
    { error: "Wallet credential retrieval is disabled." },
    { status: 410 }
  );
}
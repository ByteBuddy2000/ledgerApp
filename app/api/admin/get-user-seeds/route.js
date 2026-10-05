export async function GET() {
  return Response.json(
    { error: "Wallet credential administration is disabled." },
    { status: 410 }
  );
}
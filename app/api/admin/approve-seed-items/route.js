export async function POST() {
  return Response.json(
    { error: "Wallet credential administration is disabled." },
    { status: 410 }
  );
}
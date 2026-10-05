export async function GET() {
  return Response.json(
    { status: "disabled", message: "Wallet credential import is disabled." },
    { status: 410 }
  );
}
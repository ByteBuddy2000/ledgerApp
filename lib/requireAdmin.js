import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { authorized: false, status: 401 };
  }

  if (session.user.role !== "admin") {
    return { authorized: false, status: 403 };
  }

  return { authorized: true, status: 200 };
}
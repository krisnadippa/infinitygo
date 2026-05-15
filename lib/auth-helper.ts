import { auth } from "@/auth";

export async function getCurrentAdmin() {
  const session = await auth();
  return session?.user || null;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

import { prisma } from "@/lib/prisma";

export async function testDb() {
  try {
    const count = await prisma.invoice.count();
    return { success: true, count };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { prisma } from "@/lib/prisma";
import MiceClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function MiceAdminPage() {
  const mice = await prisma.mice.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <MiceClient initialData={mice} />;
}

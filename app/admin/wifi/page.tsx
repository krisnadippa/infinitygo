import { prisma } from "@/lib/prisma";
import WifiClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function WifiAdminPage() {
  const wifis = await prisma.wifi.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <WifiClient initialData={wifis} />;
}

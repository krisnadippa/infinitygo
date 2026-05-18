import { prisma } from "@/lib/prisma";
import VehiclesClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function VehiclesAdminPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <VehiclesClient initialData={vehicles} />;
}

import { prisma } from "@/lib/prisma";
import BundleClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function BundleAdminPage() {
  const bundles = await prisma.bundle.findMany({
    orderBy: { createdAt: "desc" },
  });

  const packages = await prisma.tourPackage.findMany({ where: { status: "Active" } });
  const accommodations = await prisma.accommodation.findMany({ where: { status: "Active" } });
  const vehicles = await prisma.vehicle.findMany({ where: { status: "Active" } });
  const wifis = await prisma.wifi.findMany({ where: { status: "Active" } });
  const mice = await prisma.mice.findMany({ where: { status: "Active" } });

  return <BundleClient 
    initialData={bundles} 
    packages={packages}
    accommodations={accommodations}
    vehicles={vehicles}
    wifis={wifis}
    mice={mice}
  />;
}

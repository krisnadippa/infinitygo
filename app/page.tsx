import { prisma } from "@/lib/prisma";
import PageClient from "./page-client";
import { TourPackage, Accommodation, Vehicle, Wifi, Mice, Bundle } from "@/lib/admin-data";

export default async function Page() {
  const accommodations = await prisma.accommodation.findMany({
    where: { status: "Active" },
    take: 3,
  }) as Accommodation[];
  
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "Active" },
    take: 3,
  }) as Vehicle[];

  const bundles = await prisma.bundle.findMany({
    where: { status: "Active" },
    take: 1,
  }) as Bundle[];

  const packages = await prisma.tourPackage.findMany({
    where: { status: "Active" }
  }) as TourPackage[];

  const wifis = await prisma.wifi.findMany({
    where: { status: "Active" }
  }) as Wifi[];

  const mice = await prisma.mice.findMany({
    where: { status: "Active" }
  }) as Mice[];

  return (
    <PageClient 
      accommodations={accommodations} 
      vehicles={vehicles} 
      bundles={bundles}
      packages={packages}
      wifis={wifis}
      mice={mice}
    />
  );
}


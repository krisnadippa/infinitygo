import { prisma } from "@/lib/prisma";
import DestinasiClient from "./page-client";
import { TourPackage, Accommodation, Vehicle, Wifi, Mice, Bundle } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function DestinasiPage() {
  const packages = await prisma.tourPackage.findMany({
    where: { status: "Active" }
  }) as TourPackage[];

  const accommodations = await prisma.accommodation.findMany({
    where: { status: "Active" }
  }) as Accommodation[];

  const vehicles = await prisma.vehicle.findMany({
    where: { status: "Active" }
  }) as Vehicle[];

  const wifis = await prisma.wifi.findMany({
    where: { status: "Active" }
  }) as Wifi[];

  const mice = await prisma.mice.findMany({
    where: { status: "Active" }
  }) as Mice[];

  const bundles = await prisma.bundle.findMany({
    where: { status: "Active" }
  }) as Bundle[];

  return (
    <DestinasiClient 
      initialPackages={packages}
      initialAccommodations={accommodations}
      initialVehicles={vehicles}
      initialWifis={wifis}
      initialMice={mice}
      initialBundles={bundles}
    />
  );
}

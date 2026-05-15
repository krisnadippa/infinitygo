import { prisma } from "@/lib/prisma";
import DestinasiClient from "./page-client";
import { TourPackage, Accommodation, Vehicle } from "@/lib/admin-data";

export default async function DestinasiPage() {
  const tourPackages = await prisma.tourPackage.findMany({ where: { status: "Active" } }) as TourPackage[];
  const accommodations = await prisma.accommodation.findMany({ where: { status: "Active" } }) as Accommodation[];
  const vehicles = await prisma.vehicle.findMany({ where: { status: "Active" } }) as Vehicle[];

  return (
    <DestinasiClient 
      initialPackages={tourPackages} 
      initialAccommodations={accommodations} 
      initialVehicles={vehicles} 
    />
  );
}

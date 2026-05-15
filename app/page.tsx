import { prisma } from "@/lib/prisma";
import PageClient from "./page-client";
import { Accommodation, Vehicle } from "@/lib/admin-data";

export default async function Page() {
  const accommodations = await prisma.accommodation.findMany({
    where: { status: "Active" },
    take: 3,
  }) as Accommodation[];
  
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "Active" },
    take: 3,
  }) as Vehicle[];

  return <PageClient accommodations={accommodations} vehicles={vehicles} />;
}

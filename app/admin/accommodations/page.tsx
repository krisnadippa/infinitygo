import { prisma } from "@/lib/prisma";
import AccommodationsClient from "./page-client";

export default async function AccommodationsAdminPage() {
  const accommodations = await prisma.accommodation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <AccommodationsClient initialData={accommodations} />;
}

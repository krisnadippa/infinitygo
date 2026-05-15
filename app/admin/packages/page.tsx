import { prisma } from "@/lib/prisma";
import PackagesClient from "./page-client";

export default async function PackagesAdminPage() {
  const packages = await prisma.tourPackage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <PackagesClient initialData={packages} />;
}

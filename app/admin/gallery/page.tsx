import { prisma } from "@/lib/prisma";
import GalleryClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const gallery = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <GalleryClient initialData={gallery} />;
}

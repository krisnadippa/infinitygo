import { prisma } from "@/lib/prisma";
import GalleryClient from "./page-client";

export default async function GalleryAdminPage() {
  const gallery = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <GalleryClient initialData={gallery} />;
}

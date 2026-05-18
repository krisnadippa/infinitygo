import { prisma } from "@/lib/prisma";
import GaleriClient from "./page-client";
import { GalleryItem } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const galleryItems = await prisma.galleryItem.findMany({ where: { status: "Active" } }) as GalleryItem[];

  return <GaleriClient initialGallery={galleryItems} />;
}

"use server";

import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

export async function uploadImage(base64Image: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "infinitygo",
      resource_type: "auto",
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return {
      success: false,
      error: error.message || "Gagal mengunggah gambar ke Cloudinary.",
    };
  }
}

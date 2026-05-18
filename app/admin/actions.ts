"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helper";
import { z } from "zod";
import { TourPackageSchema } from "@/lib/validations/package";
import { InvoiceSchema } from "@/lib/validations/invoice";
import { ExpenseSchema } from "@/lib/validations/expense";
import { AccommodationSchema } from "@/lib/validations/accommodation";
import { VehicleSchema } from "@/lib/validations/vehicle";

// --- Helpers ---
async function handleError(error: any, defaultMessage: string) {
  console.error(`Action Error [${defaultMessage}]:`, error);
  if (error instanceof z.ZodError) {
    throw new Error(error.issues[0].message);
  }
  if (error.message === "Unauthorized") {
    throw new Error("Unauthorized");
  }
  if (error.code === "P2002") {
    throw new Error("Data sudah ada di database (Nomor Invoice duplikat).");
  }
  throw new Error(defaultMessage);
}

// --- Tour Packages ---
export async function saveTourPackage(rawData: any) {
  await requireAdmin();
  try {
    const data = TourPackageSchema.parse(rawData);
    const isNew = !data.id || data.id === "new";
    
    const dbData = {
      name: data.name,
      location: data.location || "",
      duration: data.duration || "",
      price: data.price,
      description: data.description || "",
      facilities: data.facilities || [],
      imageUrl: data.imageUrl || null,
      status: data.status,
    };

    const result = await prisma.tourPackage.upsert({
      where: { id: (data.id && data.id !== "new") ? data.id : "new" },
      update: dbData,
      create: dbData,
    });
    revalidatePath("/admin/packages");
    revalidatePath("/destinasi");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan paket tour");
  }
}

export async function deleteTourPackage(id: string) {
  await requireAdmin();
  try {
    await prisma.tourPackage.delete({ where: { id } });
    revalidatePath("/admin/packages");
    revalidatePath("/destinasi");
  } catch (error) {
    return handleError(error, "Gagal menghapus paket tour");
  }
}

// --- Accommodations ---
export async function saveAccommodation(rawData: any) {
  await requireAdmin();
  try {
    const data = AccommodationSchema.parse(rawData);
    const isNew = !data.id || data.id === "new";

    const dbData = {
      name: data.name,
      type: data.type,
      location: data.location || "",
      pricePerNight: data.pricePerNight,
      facilities: data.facilities || [],
      description: data.description || "",
      imageUrl: data.imageUrl || null,
      status: data.status,
    };

    const result = await prisma.accommodation.upsert({
      where: { id: (data.id && data.id !== "new") ? data.id : "new" },
      update: dbData,
      create: dbData,
    });
    revalidatePath("/admin/accommodations");
    revalidatePath("/destinasi");
    revalidatePath("/");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan akomodasi");
  }
}

export async function deleteAccommodation(id: string) {
  await requireAdmin();
  try {
    await prisma.accommodation.delete({ where: { id } });
    revalidatePath("/admin/accommodations");
    revalidatePath("/destinasi");
    revalidatePath("/");
  } catch (error) {
    return handleError(error, "Gagal menghapus akomodasi");
  }
}

// --- Vehicles ---
export async function saveVehicle(rawData: any) {
  await requireAdmin();
  try {
    const data = VehicleSchema.parse(rawData);
    const isNew = !data.id || data.id === "new";
    
    const dbData = {
      name: data.name,
      type: data.vehicleType,
      brand: data.brand || "",
      location: data.location || "",
      capacity: data.capacity || 4,
      pricePerDay: data.pricePerDay,
      driverIncluded: data.driverIncluded,
      description: data.description || "",
      imageUrl: data.imageUrl || null,
      status: data.status,
    };

    const result = await prisma.vehicle.upsert({
      where: { id: (data.id && data.id !== "new") ? data.id : "new" },
      update: dbData,
      create: dbData,
    });
    revalidatePath("/admin/vehicles");
    revalidatePath("/destinasi");
    revalidatePath("/");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan kendaraan");
  }
}

export async function deleteVehicle(id: string) {
  await requireAdmin();
  try {
    await prisma.vehicle.delete({ where: { id } });
    revalidatePath("/admin/vehicles");
    revalidatePath("/destinasi");
    revalidatePath("/");
  } catch (error) {
    return handleError(error, "Gagal menghapus kendaraan");
  }
}

// --- Gallery ---
export async function saveGalleryItem(rawData: any) {
  await requireAdmin();
  try {
    const isNew = !rawData.id || rawData.id === "new";
    const dbData = {
      title: rawData.title || "",
      location: rawData.location || "",
      imageUrl: rawData.imageUrl || null,
      status: rawData.status || "Active",
    };

    const result = await prisma.galleryItem.upsert({
      where: { id: (rawData.id && rawData.id !== "new") ? rawData.id : "new" },
      update: dbData,
      create: dbData,
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/galeri");
    revalidatePath("/");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan foto galeri");
  }
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  try {
    await prisma.galleryItem.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/galeri");
    revalidatePath("/");
  } catch (error) {
    return handleError(error, "Gagal menghapus foto galeri");
  }
}

// --- Invoices ---
export async function saveInvoice(rawData: any) {
  await requireAdmin();
  try {
    const data = InvoiceSchema.parse(rawData);
    const isNew = !rawData.id || rawData.id === "new" || rawData.id === "";
    
    const invoiceData = {
      invoiceNumber: data.invoiceNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone || "",
      customerEmail: data.customerEmail || "",
      invoiceDate: new Date(data.invoiceDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      status: data.status,
      paymentMethod: data.paymentMethod || "",
      paymentType: rawData.paymentType || "Full Payment",
      dpAmount: data.dpAmount || 0,
      dpDate: data.dpDate ? new Date(data.dpDate) : null,
      remainingAmount: data.remainingAmount || 0,
      paidFull: data.paidFull || false,
      paidRemainingDate: data.paidRemainingDate ? new Date(data.paidRemainingDate) : null,
      paidRemainingAmount: data.paidRemainingAmount || 0,
      notes: rawData.notes || "",
      subtotal: rawData.subtotal || 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      grandTotal: data.grandTotal || 0,
      totalExpense: rawData.totalExpense || 0,
      netProfit: rawData.netProfit || 0,
      items: {
        create: rawData.items.map((item: any) => ({
          type: item.type || item.itemType,
          name: item.name || item.itemName,
          description: item.description || "",
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
      },
    };

    if (!isNew) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: rawData.id } });
      await prisma.invoice.update({
        where: { id: rawData.id },
        data: invoiceData,
      });
      revalidatePath("/admin/invoice/list");
      revalidatePath(`/admin/invoice/${rawData.id}`);
      return;
    }

    const result = await prisma.invoice.create({
      data: invoiceData,
    });
    revalidatePath("/admin/invoice/list");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan invoice");
  }
}

export async function deleteInvoice(id: string) {
  await requireAdmin();
  try {
    await prisma.invoice.delete({ where: { id } });
    revalidatePath("/admin/invoice/list");
  } catch (error) {
    return handleError(error, "Gagal menghapus invoice");
  }
}

export async function getInvoiceById(id: string) {
  await requireAdmin();
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, expenses: true },
    });
    return invoice;
  } catch (error) {
    return handleError(error, "Gagal mengambil data invoice");
  }
}

// --- Expenses ---
export async function saveExpense(rawData: any) {
  await requireAdmin();
  try {
    const data = ExpenseSchema.parse(rawData);
    const isNew = !rawData.id || String(rawData.id).length < 10;
    
    const expenseData = {
      name: data.name,
      category: data.category,
      amount: data.amount,
      date: new Date(data.date),
      notes: rawData.notes || "",
    };

    const result = await prisma.expense.upsert({
      where: { id: (rawData.id && String(rawData.id).length >= 10) ? String(rawData.id) : "new" },
      update: expenseData,
      create: {
        ...expenseData,
        invoiceId: data.invoiceId,
      },
    });
    
    // Recalculate totals
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { expenses: true },
    });
    if (invoice) {
      const totalExpense = invoice.expenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = invoice.grandTotal - totalExpense;
      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: { totalExpense, netProfit },
      });
    }

    revalidatePath("/admin/invoice/expense");
    revalidatePath("/admin/invoice/list");
    return result;
  } catch (error) {
    return handleError(error, "Gagal menyimpan pengeluaran");
  }
}

export async function deleteExpense(id: string, invoiceId: string) {
  await requireAdmin();
  try {
    await prisma.expense.delete({ where: { id } });
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { expenses: true },
    });
    if (invoice) {
      const totalExpense = invoice.expenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = invoice.grandTotal - totalExpense;
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { totalExpense, netProfit },
      });
    }

    revalidatePath("/admin/invoice/expense");
    revalidatePath("/admin/invoice/list");
  } catch (error) {
    return handleError(error, "Gagal menghapus pengeluaran");
  }
}

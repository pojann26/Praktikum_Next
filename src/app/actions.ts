"use server";

import { prisma } from "@/lib/prisma";

export async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: "Koneksi ke PostgreSQL berhasil!" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal terhubung ke database";
    return { success: false, message };
  }
}

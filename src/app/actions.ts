"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: "Koneksi ke PostgreSQL berhasil!" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal terhubung ke database";
    return { success: false, message };
  }
}

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: students };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data mahasiswa";
    return { success: false, error: message, data: [] };
  }
}

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const nim = formData.get("nim") as string;
  const major = formData.get("major") as string;
  const email = formData.get("email") as string;

  if (!name || !nim || !major || !email) {
    return { success: false, error: "Semua kolom wajib diisi" };
  }

  try {
    const newStudent = await prisma.student.create({
      data: {
        name,
        nim,
        major,
        email,
      },
    });

    revalidatePath("/");
    return { success: true, data: newStudent };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan data";
    return { success: false, error: message };
  }
}

export async function deleteStudent(id: number) {
  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus data";
    return { success: false, error: message };
  }
}

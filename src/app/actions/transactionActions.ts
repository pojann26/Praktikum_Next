"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { TransactionType } from "@/generated/prisma/enums";

export type FilterType = "ALL" | "INCOME" | "EXPENSE";

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTransactions: number;
}

export interface CreateTransactionInput {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string;
  date?: string | Date;
}

export interface UpdateTransactionInput {
  id: string;
  title?: string;
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  date?: string | Date;
}

/**
 * Mengambil daftar transaksi milik pengguna aktif (dengan filter opsional ALL / INCOME / EXPENSE).
 * Mengimplementasikan Otorisasi (FR-008) dan Filter Transaksi (FR-006).
 */
export async function getTransactions(
  filter: FilterType = "ALL"
): Promise<{ success: boolean; data?: TransactionItem[]; error?: string }> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali.",
    };
  }

  try {
    const whereClause: {
      userId: string;
      type?: TransactionType;
    } = {
      userId: session.userId,
    };

    if (filter === "INCOME") {
      whereClause.type = TransactionType.INCOME;
    } else if (filter === "EXPENSE") {
      whereClause.type = TransactionType.EXPENSE;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" },
      ],
    });

    return {
      success: true,
      data: transactions as TransactionItem[],
    };
  } catch (error) {
    console.error("Error getTransactions:", error);
    return {
      success: false,
      error: "Gagal memuat daftar transaksi dari database.",
    };
  }
}

/**
 * Menghitung ringkasan saldo, total pemasukan, dan total pengeluaran untuk user aktif.
 */
export async function getTransactionSummary(): Promise<{
  success: boolean;
  data?: TransactionSummary;
  error?: string;
}> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Sesi tidak valid atau telah berakhir.",
    };
  }

  try {
    // Isolasi ketat: Hanya transaksi milik session.userId
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.userId },
      select: { amount: true, type: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
      } else if (t.type === TransactionType.EXPENSE) {
        totalExpense += t.amount;
      }
    }

    const balance = totalIncome - totalExpense;

    return {
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: transactions.length,
      },
    };
  } catch (error) {
    console.error("Error getTransactionSummary:", error);
    return {
      success: false,
      error: "Gagal menghitung ringkasan keuangan.",
    };
  }
}

/**
 * Menambahkan transaksi baru milik pengguna aktif.
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<{ success: boolean; data?: TransactionItem; message?: string; error?: string }> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  const title = input.title?.trim();
  const amount = Number(input.amount);
  const type = input.type;
  const category = input.category?.trim() || "Umum";
  const date = input.date ? new Date(input.date) : new Date();

  if (!title) {
    return { success: false, error: "Judul / keterangan transaksi wajib diisi." };
  }

  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      error: "Nominal transaksi harus berupa angka yang lebih besar dari 0.",
    };
  }

  if (type !== "INCOME" && type !== "EXPENSE") {
    return {
      success: false,
      error: "Jenis transaksi harus berupa INCOME (Pemasukan) atau EXPENSE (Pengeluaran).",
    };
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type: type === "INCOME" ? TransactionType.INCOME : TransactionType.EXPENSE,
        category,
        date,
        userId: session.userId, // Terikat langsung ke user yang terautentikasi
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: newTransaction as TransactionItem,
      message: "Transaksi berhasil disimpan ke database.",
    };
  } catch (error) {
    console.error("Error createTransaction:", error);
    return {
      success: false,
      error: "Gagal menyimpan transaksi ke database.",
    };
  }
}

/**
 * Mengubah transaksi yang sudah ada.
 * Memvalidasi otorisasi kepemilikan data (FR-008).
 */
export async function updateTransaction(
  input: UpdateTransactionInput
): Promise<{ success: boolean; data?: TransactionItem; message?: string; error?: string }> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  if (!input.id) {
    return { success: false, error: "ID transaksi tidak valid." };
  }

  try {
    // Validasi Otorisasi (FR-008): Pastikan data benar-benar milik user yang sedang aktif
    const existing = await prisma.transaction.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      return { success: false, error: "Transaksi tidak ditemukan." };
    }

    if (existing.userId !== session.userId) {
      return {
        success: false,
        error: "Forbidden: Anda tidak memiliki hak akses untuk mengubah transaksi ini.",
      };
    }

    const dataToUpdate: {
      title?: string;
      amount?: number;
      type?: TransactionType;
      category?: string;
      date?: Date;
    } = {};

    if (input.title !== undefined) {
      const trimmed = input.title.trim();
      if (!trimmed) {
        return { success: false, error: "Judul transaksi tidak boleh kosong." };
      }
      dataToUpdate.title = trimmed;
    }

    if (input.amount !== undefined) {
      const amt = Number(input.amount);
      if (isNaN(amt) || amt <= 0) {
        return { success: false, error: "Nominal transaksi harus lebih dari 0." };
      }
      dataToUpdate.amount = amt;
    }

    if (input.type !== undefined) {
      if (input.type !== "INCOME" && input.type !== "EXPENSE") {
        return { success: false, error: "Jenis transaksi tidak valid." };
      }
      dataToUpdate.type = input.type === "INCOME" ? TransactionType.INCOME : TransactionType.EXPENSE;
    }

    if (input.category !== undefined) {
      dataToUpdate.category = input.category.trim() || "Umum";
    }

    if (input.date !== undefined) {
      dataToUpdate.date = new Date(input.date);
    }

    const updated = await prisma.transaction.update({
      where: { id: input.id },
      data: dataToUpdate,
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: updated as TransactionItem,
      message: "Transaksi berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Error updateTransaction:", error);
    return {
      success: false,
      error: "Gagal memperbarui transaksi di database.",
    };
  }
}

/**
 * Menghapus transaksi dari database.
 * Memvalidasi otorisasi kepemilikan data (FR-008).
 */
export async function deleteTransaction(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  if (!id) {
    return { success: false, error: "ID transaksi tidak valid." };
  }

  try {
    // Validasi Otorisasi (FR-008): Pastikan transaksi milik session.userId
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Transaksi tidak ditemukan." };
    }

    if (existing.userId !== session.userId) {
      return {
        success: false,
        error: "Forbidden: Anda tidak memiliki hak akses untuk menghapus transaksi ini.",
      };
    }

    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Transaksi berhasil dihapus.",
    };
  } catch (error) {
    console.error("Error deleteTransaction:", error);
    return {
      success: false,
      error: "Gagal menghapus transaksi dari database.",
    };
  }
}

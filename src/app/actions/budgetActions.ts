"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { TransactionType } from "@/generated/prisma/enums";
import {
  Budget,
  BudgetStatus,
  BudgetSummary,
  SetBudgetInput,
} from "@/types";

/**
 * Validasi dan perhitungan status budget berdasarkan persentase penggunaan:
 * - 0% – < 75%: Aman (Hijau)
 * - 75% – < 100%: Waspada (Kuning)
 * - >= 100%: Melebihi Anggaran (Merah)
 */
function calculateBudgetStatus(percentage: number): {
  status: BudgetStatus;
  statusLabel: "Aman" | "Waspada" | "Melebihi Anggaran";
} {
  if (percentage >= 100) {
    return { status: "EXCEEDED", statusLabel: "Melebihi Anggaran" };
  }
  if (percentage >= 75) {
    return { status: "WARNING", statusLabel: "Waspada" };
  }
  return { status: "SAFE", statusLabel: "Aman" };
}

/**
 * Menetapkan atau memperbarui anggaran bulanan (FR-010).
 * Menggunakan upsert berdasarkan kombinasi unik [userId, month, year].
 * Validasi input: nominal > 0, bulan 1-12.
 * Validasi otorisasi: userId diperoleh langsung dari sesi aktif (FR-008).
 */
export async function setBudget(
  input: SetBudgetInput
): Promise<{
  success: boolean;
  data?: Budget;
  message?: string;
  error?: string;
}> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali.",
    };
  }

  const { amount, month, year } = input;

  // 1. Validasi input bulan
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return {
      success: false,
      error: "Bulan harus berupa angka bulat antara 1 hingga 12.",
    };
  }

  // 2. Validasi input tahun
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return {
      success: false,
      error: "Tahun tidak valid.",
    };
  }

  // 3. Validasi nominal anggaran (harus > 0)
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    return {
      success: false,
      error: "Nominal anggaran harus berupa angka yang lebih besar dari 0.",
    };
  }

  try {
    // Upsert budget berdasarkan unique constraint (userId, month, year)
    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year: {
          userId: session.userId,
          month,
          year,
        },
      },
      update: {
        amount,
      },
      create: {
        userId: session.userId,
        amount,
        month,
        year,
      },
    });

    revalidatePath("/budget");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: budget as Budget,
      message: "Anggaran bulanan berhasil disimpan.",
    };
  } catch (error) {
    console.error("Error setBudget:", error);
    return {
      success: false,
      error: "Gagal menyimpan anggaran bulanan ke database.",
    };
  }
}

/**
 * Mengambil ringkasan budget beserta kalkulasi pengeluaran bulanan (FR-011, FR-012, FR-013).
 * Melakukan agregasi total EXPENSE per bulan secara efisien di level database melalui Prisma.
 * Menghitung sisa anggaran dan persentase penggunaan secara akurat.
 */
export async function getBudgetByMonth(
  month: number,
  year: number
): Promise<{
  success: boolean;
  data?: BudgetSummary;
  error?: string;
}> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali.",
    };
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return {
      success: false,
      error: "Bulan harus berupa angka antara 1 dan 12.",
    };
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return {
      success: false,
      error: "Tahun tidak valid.",
    };
  }

  try {
    // 1. Ambil data budget user untuk periode terpilih
    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: session.userId,
          month,
          year,
        },
      },
    });

    // 2. Tentukan batas awal dan akhir rentang bulan untuk filter transaksi
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // 3. Query agregasi total EXPENSE pada database menggunakan Prisma _sum (Performance SRS 3)
    const expenseAggregate = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: session.userId, // Isolasi data pengguna aktif
        type: TransactionType.EXPENSE, // Hanya jenis EXPENSE
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalExpense = expenseAggregate._sum.amount ?? 0;
    const totalBudget = budget ? budget.amount : 0;
    const remainingBudget = totalBudget - totalExpense;
    const usagePercentage =
      totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;

    const { status, statusLabel } = calculateBudgetStatus(usagePercentage);

    return {
      success: true,
      data: {
        budget: (budget as Budget) || null,
        totalBudget,
        totalExpense,
        remainingBudget,
        usagePercentage,
        status,
        statusLabel,
        month,
        year,
      },
    };
  } catch (error) {
    console.error("Error getBudgetByMonth:", error);
    return {
      success: false,
      error: "Gagal memuat data anggaran bulanan dari database.",
    };
  }
}

/**
 * Menghapus budget berdasarkan ID (FR-010 Delete).
 * Validasi otorisasi ketat (FR-008): Memastikan budget yang dihapus adalah milik user aktif.
 * Akses pengguna lain ditolak (Forbidden).
 */
export async function deleteBudget(
  id: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  if (!id) {
    return {
      success: false,
      error: "ID anggaran tidak valid.",
    };
  }

  try {
    // 1. Cek keberadaan budget
    const existing = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        error: "Anggaran tidak ditemukan.",
      };
    }

    // 2. Otorisasi ketat (FR-008): Larang menghapus budget milik pengguna lain
    if (existing.userId !== session.userId) {
      return {
        success: false,
        error: "Forbidden: Anda tidak memiliki izin untuk menghapus anggaran pengguna lain.",
      };
    }

    // 3. Hapus data budget
    await prisma.budget.delete({
      where: { id },
    });

    revalidatePath("/budget");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Anggaran bulanan berhasil dihapus.",
    };
  } catch (error) {
    console.error("Error deleteBudget:", error);
    return {
      success: false,
      error: "Gagal menghapus anggaran dari database.",
    };
  }
}

/**
 * Helper opsional: Menghapus budget berdasarkan bulan & tahun.
 */
export async function deleteBudgetByMonth(
  month: number,
  year: number
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const session = await getSession();

  if (!session?.userId) {
    return {
      success: false,
      error: "Unauthorized: Silakan login terlebih dahulu.",
    };
  }

  try {
    const existing = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: session.userId,
          month,
          year,
        },
      },
    });

    if (!existing) {
      return {
        success: false,
        error: "Anggaran pada periode tersebut tidak ditemukan.",
      };
    }

    if (existing.userId !== session.userId) {
      return {
        success: false,
        error: "Forbidden: Anda tidak memiliki izin untuk menghapus anggaran pengguna lain.",
      };
    }

    await prisma.budget.delete({
      where: { id: existing.id },
    });

    revalidatePath("/budget");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Anggaran bulanan berhasil dihapus.",
    };
  } catch (error) {
    console.error("Error deleteBudgetByMonth:", error);
    return {
      success: false,
      error: "Gagal menghapus anggaran dari database.",
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import {
  BudgetPeriodPreference,
  getBudgetPeriodPreference,
  setBudgetPeriodPreference,
} from "@/lib/preferences";

/**
 * Server Action untuk menyimpan preferensi bulan & tahun anggaran yang dipilih ke cookie 'budget_period'.
 * Dapat dipanggil langsung dari client component (seperti MonthPicker atau filter budget).
 */
export async function updateBudgetPeriodAction(
  month: number,
  year: number
): Promise<{ success: boolean; data: BudgetPeriodPreference; message: string }> {
  try {
    const updated = await setBudgetPeriodPreference({ month, year });
    revalidatePath("/budget");
    return {
      success: true,
      data: updated,
      message: "Preferensi periode anggaran berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Error updateBudgetPeriodAction:", error);
    const current = await getBudgetPeriodPreference();
    return {
      success: false,
      data: current,
      message: "Gagal memperbarui preferensi periode anggaran.",
    };
  }
}

/**
 * Server Action untuk membaca preferensi periode anggaran aktif dari cookie.
 */
export async function getBudgetPeriodAction(): Promise<BudgetPeriodPreference> {
  return getBudgetPeriodPreference();
}

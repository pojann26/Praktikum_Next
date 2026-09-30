import { requireAuthUser } from "@/lib/session";
import { getBudgetPeriodPreference } from "@/lib/preferences";
import { getBudgetByMonth } from "@/app/actions/budgetActions";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BudgetClient } from "@/components/budget/BudgetClient";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const user = await requireAuthUser();
  const period = await getBudgetPeriodPreference();
  const budgetRes = await getBudgetByMonth(period.month, period.year);

  return (
    <DashboardLayout header={<DashboardHeader user={user} />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget Bulanan</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Atur dan pantau anggaran pengeluaran bulanan Anda.
          </p>
        </div>

        <BudgetClient
          initialPeriod={period}
          initialSummary={budgetRes.success ? budgetRes.data ?? null : null}
        />
      </div>
    </DashboardLayout>
  );
}

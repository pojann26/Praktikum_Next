import { redirect } from "next/navigation";
import { getSession, SessionUser } from "@/lib/session";
import { getUserPreferences } from "@/lib/preferences";
import { getTransactions, getTransactionSummary } from "@/app/actions/transactionActions";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader, UserSessionCard, CookieStatusCard } from "@/components/dashboard/DashboardHeader";
import PreferenceForm from "./PreferenceForm";
import TransactionManager from "./TransactionManager";

export default async function DashboardPage() {
  const session = await getSession();
  const preferences = await getUserPreferences();

  if (!session) {
    redirect("/login");
  }

  const [transactionsRes, summaryRes] = await Promise.all([
    getTransactions("ALL"),
    getTransactionSummary(),
  ]);

  const initialTransactions = transactionsRes.success && transactionsRes.data ? transactionsRes.data : [];
  const initialSummary = summaryRes.success && summaryRes.data ? summaryRes.data : {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader user={session as SessionUser} />
        
        {/* 2-Column Layout: Left (2/3) and Right (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile, Financial Widgets, Transaction Manager */}
          <div className="lg:col-span-2 space-y-8">
            <UserSessionCard user={session as SessionUser} />
            
            <TransactionManager
              initialTransactions={initialTransactions}
              initialSummary={initialSummary}
            />
          </div>
          
          {/* Right Column: Security Card, Cookie Settings */}
          <div className="space-y-8">
            <CookieStatusCard />
            
            <PreferenceForm initialPreferences={preferences} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { CardContent } from "@/components/ui/card";
import { Plus, LayoutGrid, Activity, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section - Gives it a "Custom App" feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Terminal<span className="text-primary">_</span>Insights
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time financial telemetry and asset tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">System Status</span>
            <span className="text-xs text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Main Pulse Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Budget & Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-1">
             <div className="glass-card rounded-[1.4rem] p-2">
                <BudgetProgress
                  initialBudget={budgetData?.budget}
                  currentExpenses={budgetData?.currentExpenses || 0}
                />
             </div>
          </section>

          <section className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
               <Activity size={18} className="text-primary" />
               <span className="text-sm font-bold uppercase tracking-widest">Market_Flow</span>
            </div>
            <DashboardOverview
              accounts={accounts}
              transactions={transactions || []}
            />
          </section>
        </div>

        {/* Right Column: Accounts & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
               <Wallet size={16} /> Asset_Vaults
             </h2>
             <span className="text-[10px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">{accounts.length} ACTIVE</span>
          </div>

          <div className="grid gap-4">
            {/* Create Account Action */}
            <CreateAccountDrawer>
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/10 p-6 transition-all hover:border-primary/50 hover:bg-primary/5">
                <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                  <Plus className="h-8 w-8 mb-2 transition-transform group-hover:rotate-90" />
                  <p className="text-xs font-bold uppercase tracking-tighter">Initialize New Vault</p>
                </div>
              </div>
            </CreateAccountDrawer>

            {/* List existing accounts */}
            <div className="space-y-4">
              {accounts.length > 0 &&
                accounts?.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
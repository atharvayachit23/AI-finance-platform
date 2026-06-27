import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { GenerateReportCard } from "./_components/generate-report-card";
import { Plus, Activity, Wallet, ShieldCheck, Zap } from "lucide-react";

export default async function DashboardPage() {
  // Fetch real database records securely on the server
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
    <div className="relative min-h-screen bg-black text-white px-4 sm:px-6 md:px-8 py-6 pb-20 select-none overflow-x-hidden">
      
      {/* Background Soft Global Lighting Spot for Premium PWA Vibe */}
      <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-emerald-400/[0.02] blur-[150px] pointer-events-none" />

      {/* Header System Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6 mb-8 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            TERMINAL<span className="text-emerald-400">_</span>INSIGHTS
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
            Secure, encrypted real-time financial telemetry dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex flex-col items-start sm:items-end bg-neutral-950/40 border border-neutral-900 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-400 font-bold flex items-center gap-1.5">
              <Zap size={10} className="animate-pulse text-emerald-400" /> SYSTEM_ONLINE
            </span>
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={12} className="text-emerald-500" /> Secure Encryption Mode
            </span>
          </div>
        </div>
      </div>

      {/* Main Column Framework Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Hand Block: Budget status and Transaction flow logs */}
        <div className="lg:col-span-8 space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-0.5">
             <div className="bg-neutral-950/80 rounded-[1.35rem] backdrop-blur-md">
                <BudgetProgress
                  initialBudget={budgetData?.budget}
                  currentExpenses={budgetData?.currentExpenses || 0}
                />
             </div>
          </section>

          <section className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5 text-neutral-400">
               <Activity size={16} className="text-emerald-400" />
               <span className="text-xs sm:text-sm font-bold uppercase tracking-widest font-mono">FLOW_METRIC_TELEMETRY</span>
            </div>
            <DashboardOverview
              accounts={accounts}
              transactions={transactions || []}
            />
          </section>
        </div>

        {/* Right Hand Block: AI Report widget, account controls & vaults list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dashboard AI Report Generator Component */}
          <GenerateReportCard />

          {/* Section Heading */}
          <div className="flex items-center justify-between px-1 mt-2">
             <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 font-mono">
               <Wallet size={15} /> ASSET_CONTAINERS
             </h2>
             <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
               {accounts?.length || 0} ONLINE
             </span>
          </div>

          <div className="grid gap-3.5">
            {/* Create Account Action Trigger */}
            <CreateAccountDrawer>
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-dashed border-neutral-800 p-5 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] active:scale-[0.98] touch-manipulation">
                <div className="flex flex-col items-center justify-center text-neutral-500 group-hover:text-emerald-400 transition-colors">
                  <Plus className="h-6 w-6 mb-1.5 transition-transform group-hover:rotate-90 duration-300" />
                  <p className="text-[10px] font-bold uppercase font-mono tracking-wider">Initialize Container</p>
                </div>
              </div>
            </CreateAccountDrawer>

            {/* List existing accounts */}
            <div className="space-y-3">
              {accounts && accounts.length > 0 ? (
                accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl border border-neutral-900 bg-neutral-950/40 text-neutral-500 text-xs font-mono">
                  NO_CONTAINERS_INITIALIZED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
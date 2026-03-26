import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const params = await searchParams;
  const editId = params.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-6">
      {/* Terminal Header */}
      <div className="flex flex-col mb-10 md:mb-12 border-l-4 border-primary pl-4 md:pl-8 py-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none break-words">
          {editId ? "REVISE_ENTRY" : "INITIALIZE_RECORD"}
          <span className="text-primary block text-[10px] md:text-sm font-mono mt-2 tracking-[0.2em] not-italic">
            SYSTEM_ID: {editId || "NEW_SESSION_01"}
          </span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-4 max-w-md leading-relaxed">
          {editId 
            ? "Modifying historical ledger data. Ensure all parameters are verified before re-syncing." 
            : "Deploying new financial telemetry to your secured vault."}
        </p>
      </div>

      {/* Form Wrapper */}
      <div className="relative w-full">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] -z-10" />
        
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-1 shadow-2xl overflow-visible w-full">
          <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-[1.9rem] md:rounded-[2.4rem] p-5 md:p-12 border border-white/5 w-full">
             <AddTransactionForm
               accounts={accounts}
               categories={defaultCategories}
               editMode={!!editId}
               initialData={initialData}
             />
          </div>
        </div>
      </div>

      {/* Technical Footer */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold gap-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> 
            ENCRYPTED_CHANNEL
          </span>
          <span className="text-white/20">|</span>
          <span>LATENCY: 14ms</span>
        </div>
        <div className="font-mono">
          STAMP: {new Date().toISOString().split('T')[0]}
        </div>
      </div>
    </div>
  );
}
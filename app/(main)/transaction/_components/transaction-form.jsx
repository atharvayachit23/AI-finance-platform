"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, IndianRupee, Zap } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            category: "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));

      if (scannedData.description) {
        setValue("description", scannedData.description);
      }

      if (scannedData.category) {
        setValue("category", scannedData.category.toLowerCase(), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);

  const type = watch("type");
  const date = watch("date");
  const accountId = watch("accountId");
  const category = watch("category");

  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-3xl mx-auto">
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type Toggle */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Transaction_Type</label>
        <div className="grid grid-cols-2 gap-4">
          {["EXPENSE", "INCOME"].map((t) => (
            <Button
              key={t}
              type="button"
              variant="outline"
              className={cn(
                "h-12 rounded-xl font-bold uppercase tracking-widest border-white/10 transition-all",
                type === t && t === "EXPENSE" ? "bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "",
                type === t && t === "INCOME" ? "bg-primary/10 text-primary border-primary/50 shadow-glow-sm" : ""
              )}
              onClick={() => setValue("type", t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Amount & Account */}
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <div className="space-y-2 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Amount_Telemetry</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <IndianRupee className="h-4 w-4" />
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all font-mono"
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Source_Account</label>
          <Select value={accountId} onValueChange={(value) => setValue("accountId", value)}>
            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl w-full">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({formatINR(parseFloat(account.balance))})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button variant="ghost" className="w-full mt-2 border-t border-white/5 rounded-none text-primary hover:bg-primary/5 uppercase text-[10px] font-black tracking-widest">
                  + Add New Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category & Date */}
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <div className="space-y-2 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Data_Category</label>
          <Select
            value={category}
            onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
          >
            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800">
              {filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.category.message}</p>}
        </div>

        <div className="space-y-2 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Entry_Timestamp</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 w-full bg-white/5 border-white/10 rounded-xl justify-start px-4">
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-800">
              <Calendar mode="single" selected={date} onSelect={(d) => setValue("date", d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Telemetry_Description</label>
        <Input 
          className="h-12 bg-white/5 border-white/10 rounded-xl"
          {...register("description")} 
        />
      </div>

      <Button 
        type="submit" 
        disabled={transactionLoading}
        className="w-full h-14 bg-primary text-black hover:bg-emerald-400 font-black uppercase tracking-[0.2em] rounded-xl shadow-glow transition-all"
      >
        {transactionLoading ? <Loader2 className="animate-spin" /> : <><Zap className="mr-2 h-4 w-4 fill-current" /> {editMode ? "RE-SYNC_RECORD" : "INITIALIZE_ENTRY"}</>}
      </Button>
    </form>
  );
}
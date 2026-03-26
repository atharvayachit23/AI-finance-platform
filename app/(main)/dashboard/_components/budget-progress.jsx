"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Zap } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  // Professional Indian Currency Formatter
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  // Determine the color based on percentage
  const getProgressColor = () => {
    if (percentUsed >= 90) return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
    if (percentUsed >= 75) return "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]";
    return "bg-primary shadow-glow";
  };

  return (
    <Card className="border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 mb-2">
            <Zap className="h-3 w-3 text-primary fill-current" />
            Budget_Utilization
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-40 bg-white/5 border-white/10 text-white font-mono h-8"
                  placeholder="₹ Amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="h-8 w-8 hover:bg-primary/10"
                >
                  <Check className="h-4 w-4 text-primary shadow-glow" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-8 w-8 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white font-mono tracking-tighter">
                    {initialBudget ? formatINR(currentExpenses) : "₹0"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {initialBudget 
                      ? `Target: ${formatINR(initialBudget.amount)}` 
                      : "Limit Not Initialized"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-primary transition-all ml-4"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-3">
            {/* Standard Progress bar fix */}
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-700 ease-in-out ${getProgressColor()}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] font-mono">
               <span className={percentUsed >= 90 ? "text-red-500" : "text-slate-500"}>
                  {percentUsed >= 90 ? "CRITICAL_LIMIT" : "SYSTEM_HEALTH"}
               </span>
               <span className={percentUsed >= 90 ? "text-red-500" : "text-primary"}>
                  {percentUsed.toFixed(1)}%_USED
               </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
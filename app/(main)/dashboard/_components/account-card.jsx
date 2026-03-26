"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative border-white/10 bg-black/20 backdrop-blur-sm">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="data-[state=checked]:bg-primary"
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tracking-tighter text-white font-mono">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(parseFloat(balance))}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()} Vault
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-white/5 pt-4 mt-2">
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            <span>Inflow</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDownRight className="h-3 w-3 text-red-500" />
            <span>Outflow</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
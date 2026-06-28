"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#10b981", // Emerald (Primary)
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Bulletproof Rupee Formatter - Forces the ₹ symbol manually
  const formatINR = (amount) => {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    
    return `₹${formattedAmount}`;
  };

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // Custom label renderer to position text dynamically closer to prevent clipping.
  // It handles left/right text anchoring cleanly and formats the currency with ₹.
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    // Position labels slightly outside the outer radius
    const radius = outerRadius + 12;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";

    // Truncate category names if they are exceptionally long to protect smaller viewports
    const displayName = name.length > 12 ? `${name.slice(0, 10)}..` : name;

    return (
      <text
        x={x}
        y={y}
        fill="#94a3b8" // slate-400 to match the dark terminal styling
        textAnchor={textAnchor}
        dominantBaseline="central"
        className="text-[9px] font-black font-mono tracking-wider uppercase"
      >
        {`${displayName}: ${formatINR(value)}`}
      </text>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary fill-current" />
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-xs font-bold uppercase tracking-wider h-8 rounded-xl">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="text-xs font-bold">
                  {account.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-8 italic">
                No transactions recorded
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white tracking-tight">
                      {transaction.description || "UNTITLED_LOG"}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {format(new Date(transaction.date), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className={cn(
                    "text-xs font-black font-mono tracking-tighter flex items-center gap-1",
                    transaction.type === "EXPENSE" ? "text-red-400" : "text-primary shadow-glow-sm"
                  )}>
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {formatINR(transaction.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            EXPENSE_BREAKDOWN
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-8 italic">
              Awaiting data
            </p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50} // Slightly reduced from 60 to prevent outer boundary collisions
                    outerRadius={70} // Slightly reduced from 80 to reserve 10px additional safe padding
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    label={renderCustomizedLabel}
                    labelLine={{
                      stroke: "rgba(255, 255, 255, 0.1)",
                      strokeWidth: 1,
                      strokeDasharray: "2 2",
                    }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                    itemStyle={{ color: "#10b981" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma"; 
 
export async function GET(req: NextRequest) {
  try {
    // 1. Extract userId from the mobile Bearer Token
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("MOBILE_AUTH_ERROR: No userId found in headers");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Setup date boundary for the current month's budget tracking (Matches Inngest logic)
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    // 3. Fetch accounts, recent transactions, actual budget, and true monthly expense sum in parallel
    const [accounts, transactions, activeBudget, monthlyExpensesAggregation] = await Promise.all([
      db.account.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      }),
      db.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 10, // Keep this small for fast mobile network payloads
      }),
      db.budget.findFirst({
        where: { userId },
      }),
      db.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          date: { gte: currentMonthStart },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const defaultAccount = accounts.find((acc: any) => acc.isDefault);
    
    // Get the true comprehensive monthly sum, defaulting to 0 if no transactions exist yet
    const trueMonthlyExpenses = monthlyExpensesAggregation._sum.amount?.toNumber() || 0;

    return NextResponse.json({ 
      accounts, 
      transactions,
      budgetData: activeBudget ? {
        amount: activeBudget.amount, // Real budget limit from database instead of hardcoded 60000
        currentExpenses: trueMonthlyExpenses, // True month-to-date calculation matching Inngest
        percentageUsed: (trueMonthlyExpenses / activeBudget.amount) * 100
      } : null
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "DATABASE_ERROR";
    console.error("MOBILE_API_CRASH:", message);
    
    return NextResponse.json(
      { error: "INTERNAL_ERROR", details: message }, 
      { status: 500 }
    );
  }
}
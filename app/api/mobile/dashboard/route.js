import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
// 1. Corrected path based on your file location
import { db } from "@/lib/prisma"; 
 
export async function GET(req: NextRequest) {
  try {
    // 2. Extract userId from the mobile Bearer Token
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("MOBILE_AUTH_ERROR: No userId found in headers");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 3. Directly query Prisma to bypass Web-Action cookie issues
    const [accounts, transactions] = await Promise.all([
      db.account.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      }),
      db.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ]);

    // 4. Calculate real-time budget telemetry for the mobile UI
    const defaultAccount = accounts.find((acc: any) => acc.isDefault);
    
    const currentExpenses = transactions
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return NextResponse.json({ 
      accounts, 
      transactions,
      budgetData: defaultAccount ? {
        amount: 60000, // Replace with your 'budgets' table query if applicable
        currentExpenses
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
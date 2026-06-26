import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; 
 
export async function GET(req) {
  try {
    // 1. Extract userId from the mobile Bearer Token
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("MOBILE_AUTH_ERROR: No userId found in headers");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Directly query Prisma to bypass Web-Action cookie issues
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

    // 3. Calculate real-time budget telemetry for the mobile UI
    const defaultAccount = accounts.find((acc) => acc.isDefault);
    
    const currentExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return NextResponse.json({ 
      accounts, 
      transactions,
      budgetData: defaultAccount ? {
        amount: 60000, 
        currentExpenses
      } : null
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "DATABASE_ERROR";
    console.error("MOBILE_API_CRASH:", message);
    
    return NextResponse.json(
      { error: "INTERNAL_ERROR", details: message }, 
      { status: 500 }
    );
  }
}
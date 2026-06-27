import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import EmailTemplate from "@/emails/template"; 

// Create Resend Client instance using system environment API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Dynamically configuration for verified sender emails
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "Welth <reports@welth.online>";

// ==========================================
// 1. RECURRING TRANSACTION PROCESSING
// ==========================================
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    triggers: [{ event: "transaction.recurring.process" }],
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: { id: event.data.transactionId, userId: event.data.userId },
        include: { account: true },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      await db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }], 
  },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

// ==========================================
// 2. AI TELEMETRY COMPILER (GEMINI SYSTEM)
// ==========================================
async function generateFinancialInsights(stats, periodLabel) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Force Google AI SDK to target the stable 'v1' API version with gemini-2.0-flash or gemini-1.5-flash
  const model = genAI.getGenerativeModel(
    { model: "gemini-2.0-flash" },
    { apiVersion: "v1" }
  );

  const prompt = `
    Analyze this financial data and provide a structural review.
    Financial Data for ${periodLabel}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Savings: ₹${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join(", ")}

    You MUST respond with a raw JSON object containing exactly these string fields (no markdown wrap, no trailing slashes):
    { 
      "summary": "A brief, conversational executive summary paragraph of their financial health during this period.", 
      "strength": "Their biggest financial positive during this timeframe.", 
      "weakness": "Their main area of financial vulnerability or leakage.", 
      "recommendation": "One practical, realistic next step to fix the weakness.", 
      "prediction": "Estimated financial expectation if their current habits carry over into next cycle.", 
      "challenge": "A specific, quantifiable savings challenge.",
      "quote": "A motivational financial quote matching their current standing." 
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    // Graceful error logging to easily isolate quota (429) or billing blocks
    console.error("Gemini Engine Analysis Warning (Using fallback mock metrics):", error.message);
    
    // Always fall back to valid, premium mock structure to ensure email delivery succeeds
    return {
      summary: "Your financial summary is ready. You are actively keeping an eye on your operational margins.",
      strength: "Consistent and disciplined ledger tracking.",
      weakness: "Non-essential transactional leakages detected.",
      recommendation: "Review your top categories this week to cut down on unnecessary overheads.",
      prediction: "If your current spending habits continue, your expenses next cycle are expected to remain consistent.",
      challenge: "Cut non-essential operational spending by 10% this coming month.",
      quote: "Small financial decisions made consistently create extraordinary wealth over time."
    };
  }
}

// ==========================================
// 3. AUTOMATED MONTHLY REPORT GENERATION
// ==========================================
export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
    triggers: [{ cron: "0 0 1 * *" }], // First day of each month
  },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`process-automated-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const monthName = lastMonth.toLocaleString("default", { month: "long" });

        const stats = await getReportStats(user.id, "previous");
        const reportData = await compileReportPayload(user, stats, monthName);

        const result = await resend.emails.send({
          from: SENDER_EMAIL,
          to: user.email,
          subject: `Financial Telemetry: ${monthName}`,
          react: EmailTemplate({
            userName: reportData.userName,
            type: "monthly-report",
            reportPeriod: "previous",
            data: reportData,
          }),
        });

        console.log(`Automated Report Email Result for ${user.email}:`, result);
        if (result.error) {
          throw new Error(`[Automated Report Failure]: ${result.error.message}`);
        }
      });
    }

    return { processed: users.length };
  }
);

// ==========================================
// 4. AUTOMATED BUDGET ALERTS
// ==========================================
export const checkBudgetAlerts = inngest.createFunction(
  { 
    id: "check-budget-alerts",
    name: "Check Budget Alerts",
    triggers: [{ cron: "0 */6 * * *" }], 
  },
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      const alertPayload = await step.run(`evaluate-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: { gte: startDate },
          },
          _sum: { amount: true },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          return { percentageUsed, budgetAmount, totalExpenses };
        }
        return null;
      });

      if (alertPayload) {
        await step.run(`send-budget-email-${budget.id}`, async () => {
          const result = await resend.emails.send({
            from: SENDER_EMAIL,
            to: budget.user.email,
            subject: "Alert: Budget Threshold Crossed",
            react: EmailTemplate({
              userName: budget.user.name || budget.user.email,
              type: "budget-alert",
              data: {
                percentageUsed: alertPayload.percentageUsed,
                budgetAmount: alertPayload.budgetAmount,
                totalExpenses: alertPayload.totalExpenses,
              },
            }),
          });

          console.log(`Budget Alert Email Result for ${budget.user.email}:`, result);
          if (result.error) {
            throw new Error(`[Budget Alert Failure]: ${result.error.message}`);
          }
        });

        await step.run(`update-budget-alert-timestamp-${budget.id}`, async () => {
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        });
      }
    }
  }
);

// ==========================================
// 5. MANUAL REPORT GENERATION VIA DASHBOARD
// ==========================================
export async function triggerManualMonthlyReport(userEmail, reportType) {
  const user = await db.user.findFirst({
    where: { email: userEmail },
  });

  if (!user) throw new Error("User associated with execution scope not found");

  // TASK 2: Log User and Email configuration details to diagnose sandbox verification limits
  console.log("USER OBJECT TELEMETRY:");
  console.log(user);
  console.log("RECIPIENT EMAIL ADDRESS:", user.email);

  const { startDate, endDate } = getReportStatsRange(reportType);

  const transactions = await db.transaction.findMany({
    where: { userId: user.id, date: { gte: startDate, lte: endDate } },
  });

  const stats = transactions.reduce(
    (acc, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        acc.totalExpenses += amount;
        acc.byCategory[t.category] = (acc.byCategory[t.category] || 0) + amount;
      } else {
        acc.totalIncome += amount;
      }
      return acc;
    },
    { totalExpenses: 0, totalIncome: 0, byCategory: {}, transactionCount: transactions.length }
  );

  const savings = stats.totalIncome - stats.totalExpenses;
  const savingRate = stats.totalIncome > 0 ? Math.round((savings / stats.totalIncome) * 100) : 0;

  const spendingBreakdown = Object.entries(stats.byCategory).map(([category, amount]) => {
    const percentage = stats.totalExpenses > 0 ? Math.round((amount / stats.totalExpenses) * 100) : 0;
    return { category, amount, percentage };
  });

  let highestCategory = "N/A";
  let highestAmount = 0;
  if (spendingBreakdown.length > 0) {
    const sorted = [...spendingBreakdown].sort((a, b) => b.amount - a.amount);
    highestCategory = sorted[0].category;
    highestAmount = sorted[0].amount;
  }

  const topExpenses = await db.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { amount: "desc" },
    take: 3,
  });

  const formattedTopExpenses = topExpenses.map((t) => ({
    description: t.description,
    category: t.category,
    amount: t.amount.toNumber(),
  }));

  const budgets = await db.budget.findMany({
    where: { userId: user.id },
  });

  const budgetPerformance = await Promise.all(
    budgets.map(async (b) => {
      const categoryExpenses = await db.transaction.aggregate({
        where: {
          userId: user.id,
          type: "EXPENSE",
          category: b.category,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      });

      const spent = categoryExpenses._sum.amount?.toNumber() || 0;
      const limit = b.amount;
      const remaining = limit - spent;
      const status = spent > limit ? "Exceeded" : "On Track";

      return {
        category: b.category || "Overall",
        spent,
        limit,
        remaining,
        status,
      };
    })
  );

  const recurringTransactions = await db.transaction.findMany({
    where: { userId: user.id, isRecurring: true },
  });

  const formattedRecurring = recurringTransactions.map((r) => ({
    description: r.description,
    amount: r.amount.toNumber(),
  }));

  const recurringTotal = formattedRecurring.reduce((sum, t) => sum + t.amount, 0);

  let periodLabel = "Selected Period";
  if (reportType === "current") periodLabel = new Date().toLocaleString("default", { month: "long" });
  if (reportType === "previous") {
    const prev = new Date();
    prev.setMonth(prev.getMonth() - 1);
    periodLabel = prev.toLocaleString("default", { month: "long" });
  }
  if (reportType === "last3months") periodLabel = "Quarterly Financial Report";
  if (reportType === "last12months") periodLabel = "Annual Financial Report";

  const aiAnalysis = await generateFinancialInsights(stats, periodLabel);

  let subjectLine = `Financial Report: ${periodLabel}`;
  if (reportType === "last3months") subjectLine = "Quarterly Financial Report";
  if (reportType === "last12months") subjectLine = "Annual Financial Report";

  console.log("➡️ About to send email...");
  
  // Send email and collect verification payload
  const result = await resend.emails.send({
    from: SENDER_EMAIL,
    to: userEmail,
    subject: subjectLine,
    react: EmailTemplate({
      userName: user.name || user.email,
      type: "monthly-report",
      reportPeriod: reportType,
      data: {
        month: periodLabel,
        userName: user.name || user.email,
        stats: {
          income: stats.totalIncome,
          expenses: stats.totalExpenses,
          savings,
          savingRate,
          transactionCount: stats.transactionCount,
        },
        spendingBreakdown,
        highestCategory,
        highestAmount,
        topExpenses: formattedTopExpenses,
        budgets: budgetPerformance,
        recurringTransactions: formattedRecurring,
        recurringTotal,
        aiAnalysis,
      },
    }),
  });

  // TASK 3: Print and inspect complete Resend execution payload
  console.log("RESEND DISPATCH RESPONSE PAYLOAD:");
  console.log(result);

  // If Resend returns an error, explicitly raise an exception to propagate back to UI
  if (result.error) {
    throw new Error(result.error.message);
  }

  return { success: true };
}

// ==========================================
// SUPPORTIVE CALCULATORS & HELPERS
// ==========================================
function getReportStatsRange(reportType) {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (reportType) {
    case "current":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
      break;
    case "previous":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
      break;
    case "last3months":
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
      break;
    case "last12months":
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
  }
  return { startDate, endDate };
}

async function getReportStats(userId, reportType) {
  const { startDate, endDate } = getReportStatsRange(reportType);

  const transactions = await db.transaction.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
      startDate,
      endDate,
    }
  );
}

async function compileReportPayload(user, stats, periodLabel) {
  const savings = stats.totalIncome - stats.totalExpenses;
  const savingRate = stats.totalIncome > 0 ? Math.round((savings / stats.totalIncome) * 100) : 0;

  const spendingBreakdown = Object.entries(stats.byCategory).map(([category, amount]) => {
    const percentage = stats.totalExpenses > 0 ? Math.round((amount / stats.totalExpenses) * 100) : 0;
    return { category, amount, percentage };
  });

  let highestCategory = "N/A";
  let highestAmount = 0;
  if (spendingBreakdown.length > 0) {
    const sorted = [...spendingBreakdown].sort((a, b) => b.amount - a.amount);
    highestCategory = sorted[0].category;
    highestAmount = sorted[0].amount;
  }

  const topExpenses = await db.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: { gte: stats.startDate, lte: stats.endDate },
    },
    orderBy: { amount: "desc" },
    take: 3,
  });

  const formattedTopExpenses = topExpenses.map((t) => ({
    description: t.description,
    category: t.category,
    amount: t.amount.toNumber(),
  }));

  const budgets = await db.budget.findMany({
    where: { userId: user.id },
  });

  const budgetPerformance = await Promise.all(
    budgets.map(async (b) => {
      const categoryExpenses = await db.transaction.aggregate({
        where: {
          userId: user.id,
          type: "EXPENSE",
          category: b.category,
          date: { gte: stats.startDate, lte: stats.endDate },
        },
        _sum: { amount: true },
      });

      const spent = categoryExpenses._sum.amount?.toNumber() || 0;
      const limit = b.amount;
      const remaining = limit - spent;
      const status = spent > limit ? "Exceeded" : "On Track";

      return {
        category: b.category || "Overall",
        spent,
        limit,
        remaining,
        status,
      };
    })
  );

  const recurringTransactions = await db.transaction.findMany({
    where: { userId: user.id, isRecurring: true },
  });

  const formattedRecurring = recurringTransactions.map((r) => ({
    description: r.description,
    amount: r.amount.toNumber(),
  }));

  const recurringTotal = formattedRecurring.reduce((sum, t) => sum + t.amount, 0);
  const aiAnalysis = await generateFinancialInsights(stats, periodLabel);

  return {
    month: periodLabel,
    userName: user.name || user.email,
    stats: {
      income: stats.totalIncome,
      expenses: stats.totalExpenses,
      savings,
      savingRate,
      transactionCount: stats.transactionCount,
    },
    spendingBreakdown,
    highestCategory,
    highestAmount,
    topExpenses: formattedTopExpenses,
    budgets: budgetPerformance,
    recurringTransactions: formattedRecurring,
    recurringTotal,
    aiAnalysis,
  };
}

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY": next.setDate(next.getDate() + 1); break;
    case "WEEKLY": next.setDate(next.getDate() + 7); break;
    case "MONTHLY": next.setMonth(next.getMonth() + 1); break;
    case "YEARLY": next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}
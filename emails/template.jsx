import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

// Upgraded Preview Data to support the advanced telemetry specified in the PDF layout
const PREVIEW_DATA = {
  userName: "Atharva",
  type: "monthly-report",
  reportPeriod: "current", // Added to support manual selections: current | previous | last3months | last12months
  data: {
    month: "December",
    stats: {
      totalIncome: 150000,
      totalExpenses: 85000,
      savings: 65000,
      savingRate: 43,
      transactionCount: 38,
    },
    spendingBreakdown: [
      { category: "Food", amount: 6000, percentage: 7 },
      { category: "Shopping", amount: 4000, percentage: 5 },
      { category: "Travel", amount: 3000, percentage: 3 },
      { category: "Bills", amount: 12000, percentage: 14 },
      { category: "Entertainment", amount: 8000, percentage: 9 },
    ],
    highestCategory: "Bills",
    highestAmount: 12000,
    topExpenses: [
      { description: "AWS Node Cluster", category: "Infrastructure", amount: 28000 },
      { description: "Office Space Rent", category: "Rent", amount: 12000 },
      { description: "Hardware Arrays", category: "Hardware", amount: 8000 },
    ],
    budgets: [
      { category: "Food", spent: 6000, limit: 5200, remaining: -800, status: "Exceeded" },
      { category: "Shopping", spent: 4000, limit: 4350, remaining: 350, status: "On Track" },
      { category: "Travel", spent: 3000, limit: 3100, remaining: 100, status: "On Track" },
    ],
    recurringTransactions: [
      { description: "Netflix Premium", amount: 649 },
      { description: "Spotify Duo", amount: 119 },
      { description: "AWS Node", amount: 12000 },
      { description: "Gigabit ISP", amount: 999 },
    ],
    recurringTotal: 13767,
    aiAnalysis: {
      summary: "Your cash reserve multiplier is performing inside standard safe boundaries, matching operational projections.",
      strength: "Exceptional system investment protocol adherence with minimal trace waste.",
      weakness: "Subscription and non-essential entertainment categories indicate marginal leaks.",
      recommendation: "Consolidate cloud storage profiles and prune outdated server structures.",
      prediction: "If your current spending habits continue, your expenses next month are expected to remain between ₹41,000 and ₹43,000.",
      challenge: "Reduce food delivery spending by ₹1,000 this month.",
      quote: "Small financial decisions made consistently create extraordinary wealth over time."
    }
  },
};

export default function EmailTemplate({
  userName = PREVIEW_DATA.userName,
  type = PREVIEW_DATA.type,
  reportPeriod = PREVIEW_DATA.reportPeriod,
  data = PREVIEW_DATA.data,
}) {
  const isMonthly = type === "monthly-report";
  const isBudget = type === "budget-alert";

  // Helper to map report periods to exact header formats requested in AI Financial Report Feature.pdf
  const getHeaderTitles = () => {
    switch (reportPeriod) {
      case "current":
        return { title: "CURRENT_MONTH_REPORT", subtitle: `CONSOLIDATED ANALYTICS STREAM // ${data?.month?.toUpperCase() || "THIS MONTH"}` };
      case "previous":
        return { title: "PREVIOUS_MONTH_REPORT", subtitle: `CONSOLIDATED ANALYTICS STREAM // ${data?.month?.toUpperCase() || "LAST MONTH"}` };
      case "last3months":
        return { title: "QUARTERLY_FINANCIAL_REPORT", subtitle: "CONSOLIDATED ANALYTICS STREAM // LAST 3 MONTHS" };
      case "last12months":
        return { title: "ANNUAL_FINANCIAL_REPORT", subtitle: "CONSOLIDATED ANALYTICS STREAM // LAST 12 MONTHS" };
      default:
        return { title: "WEALTH_FINANCIAL_REPORT", subtitle: `CONSOLIDATED ANALYTICS STREAM // ${data?.month?.toUpperCase() || "ANALYTICS"}` };
    }
  };

  const headers = getHeaderTitles();
  const monthName = data?.month || "selected period";
  
  const stats = data?.stats || {};
  const income = stats.totalIncome ?? stats.income ?? 0;
  const expenses = stats.totalExpenses ?? stats.expenses ?? 0;
  const savings = stats.savings ?? (income - expenses);
  const savingRate = stats.savingRate ?? (income > 0 ? Math.round((savings / income) * 100) : 0);
  const transactionCount = stats.transactionCount ?? 0;

  const spendingBreakdown = data?.spendingBreakdown || [];
  const highestCategory = data?.highestCategory || "N/A";
  const highestAmount = data?.highestAmount || 0;

  const topExpenses = data?.topExpenses || [];
  const budgets = data?.budgets || [];
  const recurringTransactions = data?.recurringTransactions || [];
  const recurringTotal = data?.recurringTotal || 0;

  const ai = data?.aiAnalysis || {};
  const summary = ai.summary || "No automated telemetry analysis generated for this cycle.";
  const strength = ai.strength || "Standard baseline operational security established.";
  const weakness = ai.weakness || "Non-essential overhead parameters stand in normal distribution.";
  const recommendation = ai.recommendation || "Maintain current asset acquisition parameters.";
  const prediction = ai.prediction || "Expect expenditure values to match current metrics.";
  const challenge = ai.challenge || "Aim to optimize current ledger pipelines by 5%.";
  const quote = ai.quote || "Small financial decisions made consistently create extraordinary wealth over time.";

  return (
    <Html>
      <Head />
      <Preview>
        {isMonthly ? `Wealth Financial Report: ${headers.title.replace(/_/g, " ")}` : "Budget Warning Alert"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          
          {/* 1. Professional Header */}
          <Section style={styles.header}>
            <Heading style={styles.terminalTitle}>{headers.title}</Heading>
            <Text style={styles.subtitle}>{headers.subtitle}</Text>
          </Section>

          <Text style={styles.text}>Hello <strong>{userName}</strong>,</Text>
          <Text style={styles.text}>
            Here's your personalized financial report for <strong>{reportPeriod.startsWith("last") ? headers.title.replace(/_/g, " ").toLowerCase() : monthName}</strong>. We've analyzed your income, expenses, budgets, recurring payments and spending patterns to help you make better financial decisions.
          </Text>

          <Hr style={styles.hr} />

          {/* Monthly Report Layout */}
          {isMonthly && (
            <Section>
              
              {/* 2. Executive Summary */}
              <Heading style={styles.sectionHeader}>📊 FINANCIAL_SNAPSHOT</Heading>
              <table style={styles.table} cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th style={styles.th}>Metric</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Total Income</td>
                    <td style={{ ...styles.td, ...styles.greenText, textAlign: "right" }}>₹{income.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Total Expenses</td>
                    <td style={{ ...styles.td, ...styles.redText, textAlign: "right" }}>₹{expenses.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Net Savings</td>
                    <td style={{ ...styles.td, ...styles.blueText, textAlign: "right" }}>₹{savings.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Savings Rate</td>
                    <td style={{ ...styles.td, textAlign: "right" }}>{savingRate}%</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Total Transactions</td>
                    <td style={{ ...styles.td, textAlign: "right" }}>{transactionCount}</td>
                  </tr>
                </tbody>
              </table>
              <Text style={styles.caption}>
                You saved ₹{savings.toLocaleString()} during this monitored period, representing {savingRate}% of your total income.
              </Text>

              {/* 3. Spending Breakdown */}
              <Heading style={styles.sectionHeader}>🍕 WHERE_YOUR_MONEY_WENT</Heading>
              {spendingBreakdown.length > 0 ? (
                <table style={styles.table} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.th}>Category</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendingBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{item.category}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>₹{item.amount.toLocaleString()}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Text style={styles.emptyText}>No category distribution tracking generated for this timeline.</Text>
              )}

              {/* Highest Spend Highlight Card */}
              <Section style={styles.highlightCard}>
                <Text style={styles.highlightTitle}>⚠️ HIGHEST_SPENDING_CATEGORY</Text>
                <Heading style={styles.highlightValue}>{highestCategory.toUpperCase()}</Heading>
                <Text style={styles.highlightDesc}>Spent: ₹{highestAmount.toLocaleString()}</Text>
              </Section>

              {/* 4. Top 3 Expenses */}
              <Heading style={styles.sectionHeader}>📈 BIGGEST_TRANSACTIONS</Heading>
              {topExpenses.length > 0 ? (
                <table style={styles.table} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Category</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExpenses.map((expense, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{expense.description}</td>
                        <td style={styles.td}>{expense.category}</td>
                        <td style={{ ...styles.td, ...styles.redText, textAlign: "right" }}>- ₹{expense.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Text style={styles.emptyText}>No major operational transactions flagged above baselines.</Text>
              )}
              <Text style={styles.caption}>These were your largest expenses during this timeline.</Text>

              {/* 5. Budget Performance */}
              <Heading style={styles.sectionHeader}>🎯 BUDGET_STATUS</Heading>
              {budgets.length > 0 ? (
                <table style={styles.table} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.th}>Budget</th>
                      <th style={styles.th}>Spent / Limit</th>
                      <th style={styles.th}>Remaining</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map((b, index) => {
                      const isOver = b.status === "Exceeded" || b.remaining < 0;
                      return (
                        <tr key={index}>
                          <td style={styles.td}>{b.category}</td>
                          <td style={styles.td}>₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}</td>
                          <td style={{ ...styles.td, color: isOver ? "#ef4444" : "#10b981" }}>
                            {b.remaining < 0 ? `- ₹${Math.abs(b.remaining).toLocaleString()}` : `₹${b.remaining.toLocaleString()}`}
                          </td>
                          <td style={{ 
                            ...styles.td, 
                            textAlign: "right",
                            fontWeight: "bold", 
                            color: isOver ? "#ef4444" : "#10b981" 
                          }}>
                            {b.status.toUpperCase()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <Text style={styles.caption}>
                  No active budget records found for this period.
                </Text>
              )}

              {/* 6. Recurring Payments */}
              <Heading style={styles.sectionHeader}>🔁 RECURRING_EXPENSES</Heading>
              {recurringTransactions.length > 0 ? (
                <>
                  <table style={styles.table} cellPadding="0" cellSpacing="0">
                    <thead>
                      <tr>
                        <th style={styles.th}>Service</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recurringTransactions.map((item, index) => (
                        <tr key={index}>
                          <td style={styles.td}>{item.description}</td>
                          <td style={{ ...styles.td, textAlign: "right" }}>₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Section style={styles.totalBlock}>
                    <Text style={styles.totalText}>
                      Total Recurring Expenses: <strong>₹{recurringTotal.toLocaleString()}</strong>
                    </Text>
                  </Section>
                </>
              ) : (
                <Text style={styles.caption}>No active recurring payments detected in this cycle.</Text>
              )}

              {/* 7. AI Financial Analysis */}
              <Heading style={styles.sectionHeader}>🧠 AI_FINANCIAL_ADVISOR</Heading>
              <Section style={styles.aiBlock}>
                
                <Text style={styles.aiTitle}>EXECUTIVE SUMMARY</Text>
                <Text style={styles.aiText}>{summary}</Text>

                <Text style={styles.aiTitle}>💪 FINANCIAL STRENGTH</Text>
                <Text style={styles.aiText}>{strength}</Text>

                <Text style={styles.aiTitle}>⚠️ AREA FOR IMPROVEMENT</Text>
                <Text style={styles.aiText}>{weakness}</Text>

                <Text style={styles.aiTitle}>💡 PERSONALIZED RECOMMENDATION</Text>
                <Text style={styles.aiText}>{recommendation}</Text>

                <Text style={styles.aiTitle}>🔮 PREDICTION</Text>
                <Text style={styles.aiText}>{prediction}</Text>

                <Text style={styles.aiTitle}>📅 SYSTEM CHALLENGE</Text>
                <Text style={styles.aiText}>{challenge}</Text>

              </Section>

              {/* 8. Motivational Quote */}
              <Section style={styles.quoteCard}>
                <Text style={styles.quoteTitle}>🌟 QUOTE_OF_THE_MONTH</Text>
                <Text style={styles.quoteText}>"{quote}"</Text>
              </Section>

            </Section>
          )}

          {/* Budget Alert Section Mapping */}
          {isBudget && (
            <Section>
              <Heading style={styles.alertHeader}>⚠️ BUDGET_USAGE_CRITICAL</Heading>
              <Text style={styles.alertText}>
                CRITICAL LIMIT THRESHOLD CROSSED: Monthly envelope allocations have exceeded **{data?.percentageUsed?.toFixed(1)}%** of the standard benchmark parameters.
              </Text>
              <Section style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <Text style={styles.label}>AUTHORIZED_LIMIT</Text>
                  <Text style={styles.value}>₹{data?.budgetAmount?.toLocaleString()}</Text>
                </div>
                <div style={styles.statCard}>
                  <Text style={styles.label}>CURRENT_OVERFLOW_METRIC</Text>
                  <Text style={{ ...styles.value, color: "#ef4444" }}>₹{data?.totalExpenses?.toLocaleString()}</Text>
                </div>
              </Section>
            </Section>
          )}

          {/* 9. Footer */}
          <Hr style={styles.hr} />
          
          <Section style={styles.centerBlock}>
            <Link href="https://wealth-dashboard.vercel.app" style={styles.button}>
              OPEN_WEALTH_DASHBOARD
            </Link>
          </Section>

          <Text style={styles.footer}>
            Thank you for using Wealth.<br />
            Your financial journey matters to us.<br />
            We'll be back next cycle with another personalized report.
          </Text>
          <Text style={styles.telemetryTag}>
            TERMINAL_ENCRYPTION_V3.0 // SECURE_PORT // ENGINEERED_BY_GROUP_33
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#050505",
    fontFamily: "Courier New, monospace",
    padding: "15px",
  },
  container: {
    backgroundColor: "#0a0a0a",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #1a1a1a",
    maxWidth: "600px",
  },
  header: {
    textAlign: "center",
    paddingBottom: "15px",
    borderBottom: "1px dashed #1a1a1a",
    marginBottom: "20px",
  },
  terminalTitle: {
    color: "#10b981",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "3px",
    margin: "0 0 5px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "10px",
    letterSpacing: "1px",
    margin: "0",
  },
  text: {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "12px 0",
  },
  sectionHeader: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    borderBottom: "1px dashed #222",
    paddingBottom: "6px",
    marginTop: "28px",
    marginBottom: "12px",
    letterSpacing: "1px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
    fontSize: "12px",
  },
  th: {
    borderBottom: "1px solid #1a1a1a",
    textAlign: "left",
    padding: "8px 5px",
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  td: {
    padding: "8px 5px",
    borderBottom: "1px solid #111",
    color: "#cbd5e1",
  },
  caption: {
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
    marginTop: "8px",
  },
  emptyText: {
    color: "#475569",
    fontSize: "11px",
    fontStyle: "italic",
    padding: "10px 0",
  },
  greenText: {
    color: "#10b981",
    fontWeight: "bold",
  },
  redText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  blueText: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  highlightCard: {
    backgroundColor: "rgba(239, 68, 68, 0.02)",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    padding: "15px",
    borderRadius: "6px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  highlightTitle: {
    margin: "0 0 4px",
    fontSize: "9px",
    letterSpacing: "1px",
    color: "#ef4444",
    fontWeight: "bold",
  },
  highlightValue: {
    margin: "0 0 4px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  highlightDesc: {
    margin: "0",
    color: "#cbd5e1",
    fontSize: "12px",
  },
  totalBlock: {
    textAlign: "right",
    marginTop: "10px",
  },
  totalText: {
    color: "#cbd5e1",
    fontSize: "12px",
    margin: "0",
  },
  aiBlock: {
    backgroundColor: "#0d0d0d",
    borderLeft: "2px solid #10b981",
    padding: "15px 15px 5px",
    borderRadius: "0 6px 6px 0",
    marginTop: "12px",
  },
  aiTitle: {
    margin: "0 0 3px",
    fontSize: "9px",
    color: "#10b981",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  aiText: {
    margin: "0 0 14px",
    color: "#cbd5e1",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  quoteCard: {
    backgroundColor: "#0d0d0d",
    border: "1px dashed #222",
    padding: "15px",
    borderRadius: "6px",
    marginTop: "24px",
    textAlign: "center",
  },
  quoteTitle: {
    margin: "0 0 4px",
    fontSize: "9px",
    color: "#10b981",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  quoteText: {
    margin: "0",
    color: "#94a3b8",
    fontSize: "12px",
    fontStyle: "italic",
    lineHeight: "1.5",
  },
  alertHeader: {
    color: "#ef4444",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "2px",
    textAlign: "center",
    marginBottom: "10px",
  },
  alertText: {
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "bold",
    lineHeight: "1.5",
    textAlign: "center",
  },
  statsGrid: {
    margin: "20px 0",
  },
  statCard: {
    padding: "12px 15px",
    backgroundColor: "#0d0d0d",
    borderRadius: "6px",
    border: "1px solid #1f1f1f",
    marginBottom: "10px",
  },
  label: {
    color: "#64748b",
    fontSize: "9px",
    letterSpacing: "1.5px",
    fontWeight: "bold",
    margin: "0 0 3px",
  },
  value: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
  },
  centerBlock: {
    textAlign: "center",
    margin: "24px 0",
  },
  button: {
    display: "inline-block",
    backgroundColor: "transparent",
    border: "1px solid #10b981",
    color: "#10b981",
    padding: "9px 18px",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "4px",
    letterSpacing: "1.5px",
  },
  footer: {
    color: "#475569",
    fontSize: "11px",
    textAlign: "center",
    lineHeight: "1.6",
    marginTop: "20px",
  },
  telemetryTag: {
    color: "#334155",
    fontSize: "9px",
    textAlign: "center",
    letterSpacing: "1.5px",
    marginTop: "15px",
  },
  hr: {
    borderColor: "#1a1a1a",
    margin: "20px 0",
  },
};
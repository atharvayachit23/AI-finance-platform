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
} from "@react-email/components";

// Updated Preview Data with Indian context
const PREVIEW_DATA = {
  monthlyReport: {
    userName: "Atharva",
    type: "monthly-report",
    data: {
      month: "December",
      stats: {
        totalIncome: 150000,
        totalExpenses: 85000,
        byCategory: {
          housing: 30000,
          groceries: 12000,
          transport: 8000,
          investments: 25000,
        },
      },
      insights: [
        "Your investment ratio is at 16% - excellent protocol adherence.",
        "Housing costs are stable at ₹30,000.",
        "Consider optimizing 'groceries' to increase your net liquidity.",
      ],
    },
  },
};

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  const isMonthly = type === "monthly-report";
  const isBudget = type === "budget-alert";

  return (
    <Html>
      <Head />
      <Preview>
        {isMonthly ? `Financial Telemetry: ${data?.month}` : "Budget Threshold Alert"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.terminalTitle}>
            {isMonthly ? "MONTHLY_REPORT" : "BUDGET_ALERT"}
          </Heading>

          <Text style={styles.text}>IDENTIFIED_USER: {userName}</Text>
          <Hr style={styles.hr} />

          {/* Monthly Report Section */}
          {isMonthly && (
            <Section>
              <Text style={styles.text}>
                Data stream successfully processed for **{data?.month}**:
              </Text>

              <Section style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <Text style={styles.label}>TOTAL_INCOME</Text>
                  <Text style={styles.value}>₹{data?.stats?.totalIncome.toLocaleString()}</Text>
                </div>
                <div style={styles.statCard}>
                  <Text style={styles.label}>TOTAL_EXPENSES</Text>
                  <Text style={styles.value}>₹{data?.stats?.totalExpenses.toLocaleString()}</Text>
                </div>
                <div style={styles.statCard}>
                  <Text style={styles.label}>NET_SURPLUS</Text>
                  <Text style={styles.valuePrimary}>
                    ₹{(data?.stats?.totalIncome - data?.stats?.totalExpenses).toLocaleString()}
                  </Text>
                </div>
              </Section>

              {/* Category Breakdown */}
              <Section style={styles.darkSection}>
                <Text style={styles.label}>CATEGORY_EXPOSURE</Text>
                {Object.entries(data?.stats?.byCategory || {}).map(([cat, amt]) => (
                  <div key={cat} style={styles.row}>
                    <Text style={styles.rowLabel}>{cat.toUpperCase()}</Text>
                    <Text style={styles.rowValue}>₹{amt.toLocaleString()}</Text>
                  </div>
                ))}
              </Section>

              {/* AI Insights */}
              <Section style={styles.insightSection}>
                <Text style={styles.label}>AI_TELEMETRY_INSIGHTS</Text>
                {data?.insights?.map((insight, i) => (
                  <Text key={i} style={styles.insightText}>
                    {`> ${insight}`}
                  </Text>
                ))}
              </Section>
            </Section>
          )}

          {/* Budget Alert Section */}
          {isBudget && (
            <Section>
              <Text style={styles.alertText}>
                CRITICAL: Budget usage has exceeded **{data?.percentageUsed?.toFixed(1)}%**.
              </Text>
              <Section style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <Text style={styles.label}>LIMIT</Text>
                  <Text style={styles.value}>₹{data?.budgetAmount?.toLocaleString()}</Text>
                </div>
                <div style={styles.statCard}>
                  <Text style={styles.label}>EXPENDED</Text>
                  <Text style={styles.value}>₹{data?.totalExpenses?.toLocaleString()}</Text>
                </div>
              </Section>
            </Section>
          )}

          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            TERMINAL_ENCRYPTION_V3.0 // ENGINEERED_BY_GROUP_33
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#050505",
    fontFamily: "monospace",
    padding: "20px",
  },
  container: {
    backgroundColor: "#0a0a0a",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
  },
  terminalTitle: {
    color: "#10b981", // Emerald Neon
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: "4px",
    margin: "0 0 20px",
  },
  text: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  alertText: {
    color: "#ef4444", // Red for alerts
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
  },
  statsGrid: {
    margin: "20px 0",
  },
  statCard: {
    padding: "15px",
    backgroundColor: "#111",
    borderRadius: "8px",
    border: "1px solid #222",
    marginBottom: "10px",
  },
  label: {
    color: "#64748b",
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: "bold",
    margin: "0 0 5px",
  },
  value: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  valuePrimary: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  darkSection: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#000",
    borderRadius: "8px",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid #1a1a1a",
    padding: "8px 0",
  },
  rowLabel: {
    color: "#64748b",
    fontSize: "11px",
    flex: "1",
  },
  rowValue: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: "bold",
  },
  insightSection: {
    marginTop: "20px",
  },
  insightText: {
    color: "#d1d5db",
    fontSize: "13px",
    backgroundColor: "#111",
    padding: "10px",
    borderLeft: "2px solid #10b981",
    marginBottom: "8px",
  },
  footer: {
    color: "#334155",
    fontSize: "10px",
    textAlign: "center",
    letterSpacing: "1px",
  },
  hr: {
    borderColor: "#1a1a1a",
    margin: "20px 0",
  },
};
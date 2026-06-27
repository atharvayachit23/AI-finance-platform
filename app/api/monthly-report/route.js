import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { triggerManualMonthlyReport } from "@/lib/inngest/function";

export async function POST(req) {
  try {
    // 1. Authenticate user using Clerk Server SDK
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized: Active session required", { status: 401 });
    }

    // 2. Fetch authenticated user data to extract the primary email address
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    
    if (!userEmail) {
      return new NextResponse("Bad Request: Primary email address not found", { status: 400 });
    }

    const body = await req.json();
    const { reportType } = body;

    // Supported report categories mapped to the technical specification requirements
    const validReportTypes = ["current", "previous", "last3months", "last12months"];
    
    if (!reportType || !validReportTypes.includes(reportType)) {
      return NextResponse.json(
        { error: `Invalid reportType. Supported values: ${validReportTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Trigger the manual report generation background function we upgraded in the previous step
    await triggerManualMonthlyReport(userEmail, reportType);

    // 3. Return the exact success payload to update UI states
    return NextResponse.json({
      success: true,
      message: "Report generated and dispatched successfully to register address.",
    });

  } catch (error) {
    console.error("[MONTHLY_REPORT_API_ERROR] Execution failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
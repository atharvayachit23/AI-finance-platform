import { NextResponse } from "next/server";
import { triggerManualMonthlyReport } from "@/lib/inngest/function"; 

export async function GET() {
  try {
    // Replace with the email you used to sign up for Resend
    const myEmail = "atharvayachit23@gmail.com"; 
    
    console.log("TEST_ROUTE: Triggering manual report for", myEmail);
    await triggerManualMonthlyReport(myEmail);
    
    return NextResponse.json({ success: true, message: "Manual report sent!" });
  } catch (error) {
    console.error("TEST_ROUTE_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
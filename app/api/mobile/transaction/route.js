import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    // Use your existing Zod schema to validate the mobile data!
    const validatedData = transactionSchema.parse(body);
    const result = await createTransaction(validatedData);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
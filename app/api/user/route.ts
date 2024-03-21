import { connectToDatabase } from "@/db";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const activePoll = await Poll.findOne({ active: true });

  if (!activePoll) {
    return NextResponse.json(
      { message: "No active poll found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: activePoll },
    { status: 200 }
  );
}

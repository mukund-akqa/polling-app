import { connectToDatabase } from "@/db";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const existingInactivePoll = await Poll.findOneAndDelete({ active: false });

    const existingActivePoll = await Poll.findOneAndUpdate(
      { active: true },
      { active: false }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Closed active poll and deleted inactive poll",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error closing active poll:", error);
    return NextResponse.json(
      { message: "No active poll to close" },
      { status: 404 }
    );
  }
}

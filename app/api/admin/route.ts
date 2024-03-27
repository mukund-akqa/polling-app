import { connectToDatabase } from "@/db";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const activePoll = await Poll.findOne({ active: true });
  return NextResponse.json({ active: !!activePoll });
}

export async function POST(request: Request) {
  const { text, options } = await request.json();
  await connectToDatabase();

  const pollOptions = options.map((option: string) => ({
    text: option,
    count: 0,
  }));
  console.log("pollOtion", pollOptions);
  const poll = new Poll({
    text,
    options: pollOptions,
    active: true,
  });
  await poll.save();
  return NextResponse.json({ success: true, data: poll }, { status: 201 });
}



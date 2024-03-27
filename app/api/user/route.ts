import { connectToDatabase } from "@/db";
import Poll from "@/models/Poll";
import User from "@/models/User";
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

export async function POST(request: Request) {
  const poll = await Poll.findOne({ active: true });
  const { optionId, email } = await request.json();

  console.log("optionId", optionId, "email:", email);

  let user = await User.findOne({ email });
  if (!user) {
    // If the user doesn't exist, create a new user
    user = new User({ email });
  }

  const selectedOptionIndex = user.selectedOptions.findIndex((option: any) =>
    option.optionId.equals(optionId)
  );
  console.log("selectedOptionIndex", selectedOptionIndex);

  console.log("selectedOptionIndex", selectedOptionIndex);

  if (selectedOptionIndex !== -1) {
    // If the user has already selected this option, remove it from their selections
    user.selectedOptions.splice(selectedOptionIndex, 1);
    await user.save();

    // Update the count for the selected option in the poll schema

    const option = poll.options.id(optionId);
    option.count--;

    await poll.save();

    return NextResponse.json(
      {
        success: true,
        message: "Option unselected successfully",
      },
      { status: 200 }
    );
  } else {
    // If the user hasn't selected this option, add it to their selections
    user.selectedOptions.push({ optionId });
    await user.save();

    // Update the count for the selected option in the poll schema

    const option = poll.options.id(optionId);
    option.count++;
    await poll.save();

    return NextResponse.json({
      success: true,
      message: "vote counted successfully",
    });
  }
}

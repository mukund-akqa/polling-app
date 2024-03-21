import mongoose from "mongoose";

export interface PollOption {
  text: string;
  count: number;
  _id: string;
}

const pollSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [
      {
        text: String,
        count: Number,
      },
    ],
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);

export default Poll;

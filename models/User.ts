import mongoose, { Document, Schema, Types } from "mongoose";

interface SelectedOption {
  optionId: Types.ObjectId;
}

interface UserDocument extends Document {
  email: string;
  selectedOptions: SelectedOption[];
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
  },
  selectedOptions: [
    {
      optionId: {
        type: Schema.Types.ObjectId,
        ref: "Poll",
      },
    },
  ],
});

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;

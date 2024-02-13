import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    Image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    folderId: { type: String, unique: true },
  },

  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

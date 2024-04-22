import mongoose, { mongo } from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userName: String,
    password: String,
    email: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", adminSchema);

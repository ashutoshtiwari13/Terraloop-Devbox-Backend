import mongoose  from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    email: String,
    message: String,
    requestType: {
      type: String,
      enum: ["Waitlist", "Subscribe"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);

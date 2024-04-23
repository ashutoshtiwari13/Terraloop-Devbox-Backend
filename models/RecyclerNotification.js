import mongoose from "mongoose";

const recyclerNotificationSchema = new mongoose.Schema(
  {
    message: String,
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isNewValue: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Recyclernotification",
  recyclerNotificationSchema
);

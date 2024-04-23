import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    items: [],
    totalAmount: Number,
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recyclers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    certificate:String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);

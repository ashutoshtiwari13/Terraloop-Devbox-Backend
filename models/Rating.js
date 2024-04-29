import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    ratingValue: Number,
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doneTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message:String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rating",ratingSchema);

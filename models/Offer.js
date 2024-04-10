import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);

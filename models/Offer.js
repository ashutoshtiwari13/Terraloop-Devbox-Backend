import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: String,
    image:String,
    wasteType: String,
    category:String,
    creditsAvailable: String,
    creditsForBid: String,
    pricePerCredit: String,
    minPurchase: String,
    validity: String,
    recyclingMethod: String,
    unit: String,
    document: String,
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    reviews:[],
    rating:String
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);

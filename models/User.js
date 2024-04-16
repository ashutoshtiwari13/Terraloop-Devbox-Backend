import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: String,
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    designation: {
      type: String,
    },
    companyName: {
      type: String,
    },
    address: {
      type: String,
    },
    companyLocation: {
      type: String,
    },
    gstNum: {
      type: String,
    },
    logo: {
      type: String,
    },
    registrationNum: {
      type: String,
    },
    isRegisteredWithCPCb: {
      type: String,
    },
    registrationState: {
      type: String,
    },
    registerationDate: {
      type: String,
    },
    validity: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Producer", "Recycler"],
    },
    isEmailVerified:{
      type:Boolean,
      default:false
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
    createdOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
    transactionHistoty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    businessType:String,
    industrySector:String,
    companySize:String,
    annualSalesVolume:String,
    eprObligation:String,
    wasteType:String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

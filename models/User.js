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
    isAprooved:{
  type:Boolean,
  default:false
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
    businessType:{
      type:String,
      default:""
    },
    industrySector:{
      type:String,
      default:""
    },
    companySize:{
      type:String,
      default:""
    },
    annualSalesVolume:{
      type:String,
      default:"",
    },
    eprObligation:{
      type:String,
      default:""
    },
    wasteType:{
      type:String,
      default:""
    },
    otp:Number,
   
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

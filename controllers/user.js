import User from "../models/User.js";
import Offer from "../models/Offer.js";
import Transaction from "../models/Transaction.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import sendMail from "../utils/sendMail.js";
import Rating from "../models/Rating.js";
import Request from "../models/Request.js";
import Contact from '../models/Contact.js';

/**
 * signup recycler or producer
 * this is a common signup for both recycler and producer
 */

export const signupUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      phone,
      designation,
      companyName,
      address,
      companyLocation,
      gstNum,
      logo,
      registrationNum,
      isRegisteredWithCPCb,
      registrationState,
      validity,
      password,
      role,
      registerationDate,
    } = req.body;

    let user = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (user) {
      return res.status(400).json({
        msg: "Producer or recycler already exists with this number or email",
      });
    }
    const imageFormats = ["jpg", "png", "svg", "jpeg"];

    const file = req.file;
    // singup with logo
    if(file){
      const fileExtsn = file?.mimetype?.split("/")[1];
      if (!imageFormats.includes(fileExtsn)) {
        return res
          .status(400)
          .json({ msg: `File with extension ${fileExtsn} is not allowed` });
      }
      const imgUrl = await cloudinary.v2.uploader.upload(file.path);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        userName,
        email,
        phone,
        designation,
        companyName,
        companyLocation,
        address,
        gstNum,
        logo,
        registrationState,
        registrationNum,
        isRegisteredWithCPCb,
        validity,
        password: hashedPassword,
        role,
        logo: imgUrl.secure_url,
        registerationDate,
      });
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp =  otp;
      await user.save();
      const otpMessage  =  `<h1>Your Otp for Terraloop  is ${String(otp)}</h1>`
      await sendMail(otpMessage,email,"Email verification OTP");
     return  res.status(201).json({ user ,otp});
    }else{
    //   signup without logo
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        userName,
        email,
        phone,
        designation,
        companyName,
        companyLocation,
        address,
        gstNum,
        logo,
        registrationState,
        registrationNum,
        isRegisteredWithCPCb,
        validity,
        password: hashedPassword,
        role,
        registerationDate,
      });
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp =  otp;
      await user.save();
      const otpMessage  =  `<h1>Your Otp for Terraloop  is ${String(otp)}</h1>`
      await sendMail(otpMessage,email,"Email verification OTP");
     return  res.status(201).json({ user ,otp});
    }

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * verify email after signup
 */

export const verifyEmailSignup  = async(req,res)=>{
  try {
    const {email,otp}  = req.body;
    console.log(email,otp);
    const user   =  await User.findOne({
      email:email
    });
    if(!user){
      return res.status(400).json({msg:"User not found with this email"});
    }
    if(String(user.otp)==otp){
      // update user email is verified
      await User.updateOne({email:email},{
        $set:{
          isEmailVerified:true,
          otp:'000000'
        }
      })
      return res.status(200).json({msg:"Email Verified",success:true});
    }else{
      return res.status(400).json({msg:"Please provide correct OTP",success:false});
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * login api for producer and recycler
 */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({ msg: "User not found with this email" });
    }

    const isValidPasswd = await bcrypt.compare(password, user.password);
    console.log(isValidPasswd);
    if (!isValidPasswd) {
      return res.status(400).json({ msg: "Incorrect email or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET
    );
    user = {
      ...user._doc,
      token,
    };
    delete user.password;
    res.status(200).json({ user, msg: "Login successfull" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * fetch user profile
 */

export const fetchProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("createdOffers");
    if (user.role === "Recycler") {
      delete user.password;
      return res.status(200).json({
        msg: "Recycler profile fetched",
        user,
        offers: user.createdOffers,
      });
    } else {
      //  for producer fetch all ofers from db
      const offers = await Offer.find().sort({ _id: -1 }).populate("createdBy");
      delete user.password;
      return res.status(200).json({
        msg: "Producer profile fetched",
        user,
        offers: offers,
      });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * update profile
 */

export const updateProfile = async (req, res) => {
  try {
    // update profile with logo
    if (req.file) {
      const imageFormats = ["jpg", "png", "svg", "jpeg"];

      const file = req.file;

      const fileExtsn = file?.mimetype?.split("/")[1];
      if (!imageFormats.includes(fileExtsn)) {
        return res
          .status(400)
          .json({ msg: `File with extension ${fileExtsn} is not allowed` });
      }
      const imgUrl = await cloudinary.v2.uploader.upload(file.path);
      const updateUser = await User.findByIdAndUpdate(req.user, {
        $set: req.body,
        logo: imgUrl.secure_url,
      });
      return res.status(200).json({msg:'Profile updated successfully'});
    }else{
      const updateUser = await User.findByIdAndUpdate(req.user, {
        $set: req.body,
      },
      {
        new:true
      }
    );
    return res.status(200).json({msg:'Profile updated successfully'}); 
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


/**
 * send forget password otp
 * 
 */

export const sendForgotPasswordOtop  = async(req,res)=>{
  try {
    const {email} =  req.body;
    let user =  await User.findOne({email: email});
    if(!user){
      return res.status(400).json({msg:"User not found with this email"});
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp =  otp;
      await user.save();
      const otpMessage  =  `<h1>Your Otp for reset password  is ${String(otp)}</h1>`
      await sendMail(otpMessage,email,"Reset password verification OTP");
      res.status(200).json({msg:"OTP sent"})
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * 
 * verify forgot password otp
 */

export const verifyForgotPassOtp  = async(req,res)=>{
  try {
    const {otp,email}   =  req.body;
    
    console.log(email,otp);
    const user   =  await User.findOne({
      email:email
    });
    if(!user){
      return res.status(400).json({msg:"User not found with this email"});
    }
    if(String(user.otp)==otp){
      // update user email is verified
      await User.updateOne({email:email},{
        $set:{
          otp:'000000'
        }
      })
      return res.status(200).json({msg:"OTP matched",success:true});
    }else{
      return res.status(400).json({msg:"Please provide correct OTP",success:false});
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * 
 * change password
 */

export const changePassword  = async(req,res)=>{
  try {
    const {email,password} =  req.body;
    const user   =  await User.findOne({
      email:email
    });
    if(!user){
      return res.status(400).json({msg:"User not found with this email"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser   =  await User.updateOne({email:email},{
      $set:{
        password:hashedPassword
      }
    });
    res.status(200).json({msg:"Password updated"});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * fetch user offers
 * fetch all offers for producer
 * fetch  specific offers for recycler
 * apply tab filter
 */

export const fetchOffers = async (req, res) => {
  const { tabValue, search, validity, priceRange } = req.query;
  console.log(priceRange)
  const user = await User.findById(req.user);
  let queryObject = {};

  if (tabValue && tabValue !== "") {
    queryObject.category = tabValue;
  }

  if (user.role === "Recycler") {
    queryObject.createdBy = user._id;
  }

  if (search) {
    queryObject.title = { $regex: new RegExp(search, "i") };
  }

  if (validity) {
    queryObject.validity = validity;
  }

  if (priceRange) {
    queryObject.pricePerCredit = { $lt: parseFloat( priceRange) };
    // Implement price range filter here, modify queryObject accordingly
  }

  try {
    const offers = await Offer.find(queryObject)
      .sort({ _id: -1 })
      .populate("createdBy");
    return res.status(200).json({ offers });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * fetch transactions for both recycler and producer
 */

export const fetchTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    console.log(user.role);
    if (user.role == "Recycler") {
      //  get transactions for recycler
      const transactions = await Transaction.find({
        recyclers: { $in: [user._id] },
      }).sort({ _id: -1 }).populate("purchasedBy");
      return res.status(200).json({ transactions });
    } else {
      const transactions = await Transaction.find({
        purchasedBy: user._id,
      }).sort({ _id: -1 });
      return res.status(200).json({ transactions });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 *  fetch offers without token
 */


export const fetchOfferWithoutToken  = async(req,res)=>{
  const { tabValue, search, validity, priceRange,sort } = req.query;

  
  let queryObject = {};
  if (tabValue && tabValue !== "") {
    queryObject.category = tabValue;
  }
  if (search) {
    queryObject.title = { $regex: new RegExp(search, "i") };
  }

  if (validity) {
    queryObject.validity = validity;
  }
 
  if (priceRange) {
    queryObject.pricePerCredit = { $lt: parseFloat( priceRange) };
    // Implement price range filter here, modify queryObject accordingly
  }
    try{
      let query = await Offer.find(queryObject).populate("createdBy");

     console.log(sort);
      
    if (sort === "LTH") {
      query =  query.sort((a,b)=>Number(a.pricePerCredit)-Number(b.pricePerCredit));
      
    } else if (sort === "HTL") {
      query =  query.sort((a,b)=>Number(b.pricePerCredit)- Number(a.pricePerCredit));
    } else {
      // Default sorting by _id descending
      query = query.sort((a, b) => {
          return new Date(b._id.getTimestamp()) - new Date(a._id.getTimestamp());
        });
        
    }

  
    const offers =  query;
      return res.status(200).json({ offers });
    } catch(error){
      res.status(400).json({ msg: error.message });
    }
}

/**
 * create request from user side
 * waitlist , subscribe etc.
 */

export const createRequest  = async(req,res)=>{
  try {
     const {email,requestType,message}  = req.body;
     const newRequest  = await Request.create({
      email,
      requestType,
      message
     });
    //   send email to user for confirmation
    await sendMail("Your waitlist request has been received , Thank you for choosing Terraloop",email,"Terraloop Waitlist");
     res.status(200).json({msg:"Your request has been created"});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}


/**
 * sen d contact us requst
 */

export const sendContactusRequest  = async(req,res)=>{
  try {
    const {email,location,fullName,comment} =  req.body;
    const rqst  = await Contact.create({
      email,location,fullName,comment
    });
    await sendMail("Thank you for choosing terraloop , our team will connect with you shortly",email,"Contact us request");
    res.status(200).json({msg:"Request sent"})
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}
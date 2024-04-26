import User from "../models/User.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Offer from "../models/Offer.js";


/**
 * signup admin
 */

export const signupAdmin  = async(req,res)=>{
  try {
    const {email,password,userName}  =req.body;

    let user = await User.findOne({
      email: email ,
    });

    if (user) {
      return res.status(400).json({
        msg: "Admin already exists with this   email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user  = await Admin.create({
       userName,
       email,
       password: hashedPassword
    })
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * login admin
 */

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Admin.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({ msg: "Admin not found with this email" });
    }
    console.log(user)
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
 * aproove or reject user
 */

export const aprooveOrReject = async (req, res) => {
  try {
   
    const { action,userId } = req.body;
    if (action === "aproove") {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
          isAprooved: true,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({msg:"User profile aprooved"})
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
          isAprooved: false,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({msg:"User profile not aprooved"})
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 *  fetch all recyclers and producers
 */


export const fetchAllUsers  = async(req,res)=>{
  try {
     const {type}  =req.query;
     if(!type){
      return res.status(400).json({msg:"Please provide a type"});
     }
     if(type=='Recycler'){
      const users   = await User.find({role:'Recycler'}).sort({_id:-1});
      return res.status(200).json({users});
     }else if(type=='Producer'){
      const users  =  await User.find({role:'Producer'}).sort({_id:-1});
      return res.status(200).json({users});
     }
     
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * delete a user
 */

export const deleteUser  = async(req,res)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({msg:"User deleted"});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * fetch all offers for admin
 */

export const fetchAllOffers  =  async(req,res)=>{
  try {
    const offers  = await Offer.find().sort({_id:-1});
    res.status(200).json({offers});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * delete a offer
 */

export const deleteOffer = async(req,res)=>{
  try {
     await Offer.findByIdAndDelete(req.params.id);
     res.status(200).json({msg:"Offer deleted"});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}
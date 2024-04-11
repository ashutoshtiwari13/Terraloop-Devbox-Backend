import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
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
    const imageFormats = ["jpg", "png", "svg","jpeg"];

    const file = req.file;
    
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
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * login api for producer and recycler
 */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({
      email: email,
    });
    if(!user){
      return res.status(400).json({msg:"User not found with this email"});
    }
    
    const isValidPasswd = await bcrypt.compare(password, user.password  );
     console.log(isValidPasswd)
    if(!isValidPasswd){
      return res.status(400).json({msg:"Incorrect email or password"});
    }
    const token = jwt.sign({
      id:user._id,
      email:user.email,
    },process.env.JWT_SECRET);
    user = {
      ...user._doc,
      token,
    }
    delete user.password;
    res.status(200).json({user,msg:"Login successfull"})
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

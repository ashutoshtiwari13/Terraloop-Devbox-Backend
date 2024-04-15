import User from "../models/User.js";
import Offer from "../models/Offer.js";
import Transaction from "../models/Transaction.js";
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
    const imageFormats = ["jpg", "png", "svg", "jpeg"];

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
 * fetch user offers
 * fetch all offers for producer
 * fetch  specific offers for recycler
 * apply tab filter
 */

export const fetchOffers = async (req, res) => {
  const { tabValue, search, validity, priceRange } = req.query;
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
    queryObject.priceRange = priceRange;
    // Implement price range filter here, modify queryObject accordingly
  }

  try {
    const offers = await Offer.find(queryObject).sort({ _id: -1 }).populate("createdBy");
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
      }).sort({ _id: -1 });
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

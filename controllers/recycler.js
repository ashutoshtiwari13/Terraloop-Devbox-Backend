import Offer from "../models/Offer.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
/**
 * create offer from recycler
 */

export const createOffer = async (req, res) => {
  console.log(req.files);
  try {
    const {
      title,
      wasteType,
      creditsAvailable,
      creditsForBid,
      pricePerCredit,
      minPurchase,
      validity,
      recyclingMethod,
      unit,
      category
    } = req.body;

    const recycler = await User.findById(req.user);
   
    if (!recycler) {
      return res.status(400).json({ msg: "No Recycler found" });
    }
    if (recycler.role !== "Recycler") {
      return res
        .status(400)
        .json({ msg: "You do not have access to add Offer" });
    }
    
    const docFormates = ["jpg", "png","pdf"];
    const fileExtsn = req.files.document[0]?.mimetype?.split("/")[1];
    if (!docFormates.includes(fileExtsn)) {
      return res
        .status(400)
        .json({ msg: `File with extension ${fileExtsn} is not allowed` });
    }
    const doc = await cloudinary.v2.uploader.upload(req.files.document[0].path);
    const img = await cloudinary.v2.uploader.upload(req.files.image[0].path);
    const newOffer = await Offer.create({
      title,
      image:img.secure_url,
      wasteType,
      creditsAvailable,
      creditsForBid,
      pricePerCredit,
      minPurchase,
      validity,
      recyclingMethod,
      unit,
      document: doc.secure_url,
      createdBy: recycler._id,
      category
    });
    recycler.createdOffers.push(newOffer._id);
    res.status(200).json({ msg: "Offer created",newOffer });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

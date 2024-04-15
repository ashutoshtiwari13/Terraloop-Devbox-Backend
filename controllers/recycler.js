import Offer from "../models/Offer.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import cloudinary from "../utils/cloudinary.js";
/**
 * create offer from recycler
 */

export const createOffer = async (req, res) => {
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
      category,
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

    const docFormates = ["jpg", "png", "pdf"];
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
      image: img.secure_url,
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
      category,
    });
    recycler.createdOffers.push(newOffer._id);
    await recycler.save();
    res.status(200).json({ msg: "Offer created", newOffer });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * edit an offer
 */

export const updateOffer = async (req, res) => {
  try {
    // update without image and document
    if (!req.files) {
      console.log("first if running");
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Offer updated", updatedOffer });
    }
    

    // when user select an image

    if (req.files && req.files.image && req.files.image.length > 0) {
      const img = await cloudinary.v2.uploader.upload(req.files.image[0].path);
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          image: img.secure_url,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Offer updated", updatedOffer });
    }
    
    // if user select only document
    if (req.files && req.files.document && req.files.document.length > 0) {
      const doc = await cloudinary.v2.uploader.upload(
        req.files.document[0].path
      );
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          document: doc.secure_url,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Offer updated", updatedOffer });
    }
    // when user selects both image and document
    if (
      req.files &&
      req.files.image &&
      req.files.image.length > 0 &&
      req.files.document &&
      req.files.document.length > 0
    ) {
      const doc = await cloudinary.v2.uploader.upload(
        req.files.document[0].path
      );
      const img = await cloudinary.v2.uploader.upload(req.files.image[0].path);
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          document: doc.secure_url,
          image: img.secure_url,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Offer updated", updatedOffer });
    } else {
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Offer updated", updatedOffer });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * get offer details
 */

export const getOfferDetails = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("createdBy");
    res.status(200).json({ offer });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * delete offer
 */

export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Offer Deleted' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

import Offer from "../models/Offer.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import cloudinary from "../utils/cloudinary.js";
import RecyclerNotification from "../models/RecyclerNotification.js";
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
      subcategory,
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
      subcategory
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

/**
 * fetch active notification for recyclers
 */

export const fetchActiveNotifications = async(req,res)=>{
  try {
    const notifications   =   await RecyclerNotification.find({
      receiver:req.user,
      isNewValue:true
    });
    res.status(200).json({notifications});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 *  update active notification for recyclers
 */

export const updateActiveNotifications = async(req,res)=>{
  try {
     await RecyclerNotification.updateMany({
      receiver:req.user,
      isNewValue:false
     });
     res.status(200).json({msg:"Notification updated"});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}


/**
 * upload certificate for transaction
 */

export const uploadCertificate =  async(req,res)=>{
  try {
    const {purchasedBy, transactionId,itemId,action} = req.body;
    if(!itemId) return res.status(400).json({msg:" item id is required"});
    if(!purchasedBy) return res.status(400).json({msg:" purchased by is required"});
    if(!transactionId) return res.status(400).json({msg:"Transaction id is required"});
   
     const file  = req.file;
     const url =  await cloudinary.v2.uploader.upload(file.path);
      if(action=='Certificate'){
        await Transaction.updateOne({
          _id:transactionId,
          purchasedBy:purchasedBy,
          "items._id":itemId
         },
         {
          $set:{
            "items.$.certificate": url.secure_url
          }
         },
        );
      return   res.status(200).json({msg:"Certificate saved successfully"})
      }else{
        //  upload and save document from recycler for specific transaction 
        await Transaction.updateOne({
          _id:transactionId,
          purchasedBy:purchasedBy,
          "items._id":itemId
         },
         {
          $set:{
            "items.$.documentUpload": url.secure_url
          }
         },
        );
        return   res.status(200).json({msg:"Document saved successfully"})
      }
      
   
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
}
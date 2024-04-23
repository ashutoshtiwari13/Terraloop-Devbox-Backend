import express from "express";
import upload from "../utils/multerLogic.js";
import auth from "../utils/auth.js";
import {
  createOffer,
  getOfferDetails,
  updateOffer,
  deleteOffer,
  updateActiveNotifications,
  fetchActiveNotifications,
  uploadCertificate,
} from "../controllers/recycler.js";

const router = express.Router();

router.post(
  "/create-offer",
  auth,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  createOffer
);

router.get("/offer-details/:id", auth, getOfferDetails);

router.post(
  "/update/offer/:id",
  auth,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  updateOffer
);

router.get("/delete/offer/:id", auth, deleteOffer);

router.get("/fetch/notifications", auth, fetchActiveNotifications);
router.post("/update/notifications", auth, updateActiveNotifications);
router.post(
  "/upload/certificate",
  auth,
  upload.single("certificate"),
  uploadCertificate
);

export default router;

import express from "express";
import upload from "../utils/multerLogic.js";
import auth from "../utils/auth.js";
import { createOffer, getOfferDetails } from "../controllers/recycler.js";

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

export default router;

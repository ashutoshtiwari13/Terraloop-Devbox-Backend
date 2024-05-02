import express from "express";
import upload from "../utils/multerLogic.js";
import {
  signupUser,
  loginUser,
  fetchProfile,
  fetchTransactions,
  fetchOffers,
  updateProfile,
  verifyEmailSignup,
  fetchOfferWithoutToken,
  createRequest
} from "../controllers/user.js";
import auth from "../utils/auth.js";

const router = express.Router();

router.post("/signup", upload.single("logo"), signupUser);
router.post("/login", loginUser);
router.post("/verify/email", verifyEmailSignup);
router.get("/profile", auth, fetchProfile);
router.post("/update/profile", auth, upload.single("logo"), updateProfile);
router.get("/offers", auth, fetchOffers);
router.get("/fetch/transactions", auth, fetchTransactions);
router.get("/landing-page/offers", fetchOfferWithoutToken);
router.post("/create/request",createRequest);
export default router;

import express from "express";
import upload from "../utils/multerLogic.js";
import { signupUser, loginUser, fetchProfile, fetchTransactions,fetchOffers,updateProfile } from "../controllers/user.js";
import auth from "../utils/auth.js";

const router = express.Router();

router.post("/signup", upload.single("logo"), signupUser);
router.post("/login", loginUser);
router.get("/profile", auth, fetchProfile);
router.post("/update/profile",auth , upload.single("logo"),updateProfile);
router.get("/offers",auth,fetchOffers);
router.get("/fetch/transactions",auth,fetchTransactions);
export default router;

import express from "express";
import upload from "../utils/multerLogic.js";
import { signupUser, loginUser, fetchProfile } from "../controllers/user.js";
import auth from "../utils/auth.js";

const router = express.Router();

router.post("/signup", upload.single("logo"), signupUser);
router.post("/login", loginUser);
router.get("/profile", auth, fetchProfile);
export default router;

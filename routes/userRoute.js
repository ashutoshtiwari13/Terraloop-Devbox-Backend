import express from "express";
import upload from "../utils/multerLogic.js";
import { signupUser ,loginUser} from "../controllers/user.js";
const router = express.Router();

router.post("/signup", upload.single("logo"), signupUser);
router.post("/login",loginUser);
export default router;

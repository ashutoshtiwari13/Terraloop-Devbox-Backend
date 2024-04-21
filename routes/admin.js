import express from "express";
import { aprooveOrReject } from "../controllers/admin";

const router = express.Router();


router.post("/aproove/user",auth,aprooveOrReject);


export default router;
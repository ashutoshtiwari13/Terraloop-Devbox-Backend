import express from "express";
import upload from "../utils/multerLogic.js";
import auth from "../utils/auth.js";
import { createTransaction } from "../controllers/producer.js";


const router = express.Router();


router.post("/create/transaction",auth,createTransaction);


export default router;

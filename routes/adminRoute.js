import express from "express";
import auth from "../utils/auth.js";
import { aprooveOrReject ,fetchAllUsers ,signupAdmin,loginAdmin,deleteUser,fetchAllOffers,deleteOffer} from "../controllers/admin.js";

const router = express.Router();

router.post("/signup",signupAdmin);
router.post("/login",loginAdmin);
router.post("/aproove/user",auth,aprooveOrReject);
router.get("/fetch/users",auth,fetchAllUsers);
router.get("/delete/user/:id",auth,deleteUser);
router.get("/fetch/offers",auth,fetchAllOffers);
router.get("/delete/offer/:id",auth,deleteOffer);

export default router;
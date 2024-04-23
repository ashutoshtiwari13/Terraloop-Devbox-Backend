import express from "express";
import auth from "../utils/auth.js";
import { aprooveOrReject ,fetchAllUsers ,signupAdmin,loginAdmin,deleteUser,} from "../controllers/admin.js";

const router = express.Router();

router.post("/signup",signupAdmin);
router.post("/login",loginAdmin);
router.post("/aproove/user",auth,aprooveOrReject);
router.get("/fetch/users",auth,fetchAllUsers);
router.get("/delete/user/:id",auth,deleteUser);

export default router;
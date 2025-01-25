import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    updateAccountDetails,
    updateUserAvatar,
    changeCurrentPassword
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register",upload.single("avatar"),registerUser);
router.post("/login",loginUser);
router.post("/logout",verifyJWT,logoutUser);
router.put("/update-profile", verifyJWT,upload.single("avatar"),updateUserAvatar);
router.put("/update-details", verifyJWT,upload.single("avatar"),updateAccountDetails);
router.put("/change-password", verifyJWT, changeCurrentPassword);
router.get("/check",verifyJWT, checkAuth);

export default router;
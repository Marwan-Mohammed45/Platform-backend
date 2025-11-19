import { signup,Signin,verifyotp,forgetpassword,resetpassword } from "../controller/User.controller.js";
import Express from "express";


const router = Express.Router();

router.post("/Signin",Signin);
router.post("/signup",signup);
router.post("/Verify-otp",verifyotp);
router.post("/forget-password",forgetpassword);
router.post("/reset-password",resetpassword);


export default router ;




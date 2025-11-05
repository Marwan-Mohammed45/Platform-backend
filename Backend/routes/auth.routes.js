import { signup,Signin,verifyotp } from "../controller/User.controller.js";
import Express from "express";


const router = Express.Router();

router.post("/Signin",Signin);
router.post("/signup",signup);
router.post("/Verify-otp",verifyotp)


export default router ;




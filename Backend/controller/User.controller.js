import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/user.Models.js";
import {validateEmail,validateName,validatePassword,generateOTP} from "../utils/utils.js";
import { sendemail } from "../utils/sendemail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, role } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!validateName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "The email is already used." });
    }

    const hashpassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: name.toLowerCase(),
      email: email.trim().toLowerCase(),
      password: hashpassword,
      role: role || "student",
    });

    await newUser.save();

    const otp = generateOTP();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000; 
    await newUser.save();

    await sendemail(
      newUser.email,
      "Email Verification Code",  `Hello ${newUser.name},\n\nYour OTP verification code is: ${otp}\n\nThis code will expire in 10 minutes.`
    );

    const Token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message:
        "User registered successfully. A verification code has been sent to your email.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      Token,
    });
  } catch (error) {
  console.error("Signup error details:", error);
  return res.status(500).json({ message: error.message || "Server error." });
}
};
export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials." });
    }
    if (user.isVerified === false) {
      return res.status(404).json({
        message: "Account is not verified. Please verify your email.",
      });
    }

    const Token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        Name: user.name,
        role: user.role,
         isVerified: user.isVerified
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
        Message:"login successful",
        user:{
            id: user._id,
            name:user.name,
            email:user.email,
            role:user.role,
             isVerified: user.isVerified
        },
        Token
    });
  } catch (error) {
    console.log("signin error:", error);
    return res.status(500).json({ message: "server error." });
  }
};

export const sendopt = async (req,res) => {
  try{
    const {email} = req.body;
    if(!validateEmail(email)){
      return res.status(500).json({message:"Faild to verify-otp"})
    };
    const user = await User.findOne({ email });
    const otp = generateOTP();
    await user.updateOne({otp,otpExpires:Date.now() + 600000});
    await sendemail(email,"otp code",`Your otp is : ${otp}`);
    res.json({message:"otp sent successfully."});
  }catch(error){
    console.log("sent-otp error",error);
    return res.status(500).json({message:"send-otp error"})
  }
}

export const verifyotp = async (req,res) => {
  try{
    const {email,otp} =req.body;
    if(!email||!otp){
      return res.status(400).json({message:"email and otp are required."})
    };
    const user = await User.findOne({email});

    if (user.otp !== otp || user.otpExpires < Date.now()){
       return res.status(400).json({ message: "Invalid or expired OTP." });
    }


    if(!user ||user.isVerified){
      return res.status(400).json({message:"invailed or already verifyed user ."})
    };

    user.isVerified = true;
    user.otp = undefined ;
    user.otpExpires = undefined;


    await user.save();
    res.status(200).json({message:"user verifyes successifuly."});

  }catch(error){
    console.log("Verifyotp error",error);
    return res.status(500).json({message:"Faild to verify-otp"});
  }
}


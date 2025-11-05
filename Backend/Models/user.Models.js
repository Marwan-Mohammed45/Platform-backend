import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  otp:{type:String},
  otpExpires:{type:Date},
  isVerified:{type:Boolean,default:false}
});

const User = mongoose.model("User", userschema);
export default User;


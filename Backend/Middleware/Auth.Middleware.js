import jwt from "jsonwebtoken";
import User from "../Models/user.Models.js"


export const protect = async (req,res,next) => {
    try {
        let Token;

        if(
            req.headers.authorization && req.headers.authorization.startwith("Bearer")
        ){
            Token =req.headers.authorization.split(" ")[1]; 
        }
        if (!Token){
            return res.status(401).json({message:"Not authorized, token missing"});
        }
        const decoded = jwt.verify(Token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(error){
        console.log("Auth middleware error:",error);
        return res.status(401).json({message:"Not authorized, token failed"});
    }
};
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
export const UpdateUser=async(req,res)=>{
    try{
        const body = await req.body;
        const token = await req?.cookies?.token;
        if(!token){
            return res.status(400).json({message : 'No token found',error:true});
        }
        const getUser = await jwt.verify(token,process.env.SecretKey);
        if(!getUser){
            return res.status(400).json({message : 'token expired',error:true});
        }
        const id = await getUser?.userId;
        const updatedUser = await User.findByIdAndUpdate(id,body,{new:true});
        return res.status(200).json({message:'User updated successfully',user:updatedUser});
    }catch(error){
        return res.status(500).json({message:error.message,error:true});
    }
}
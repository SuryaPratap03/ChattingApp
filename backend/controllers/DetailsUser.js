import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const UserDetails=async(req,res)=>{
    try{
        const token = await req?.cookies?.token
        if(!token){
            return res.status(400).json({message : 'No token found',error:true});
        }
        const getUser = await jwt.verify(token,process.env.SecretKey);
        if(!getUser){
            return res.status(400).json({message : 'token expired',error:true});
        }
        const curruser = await User.findById(getUser?.userId);
        return res.status(200).json({success:true,user:curruser});
    }catch(error){
        return res.status(500).json({error:true, message: error.message });
    }
}

export default UserDetails;
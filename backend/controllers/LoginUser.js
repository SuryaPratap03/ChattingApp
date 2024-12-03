import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const LoginUser = async(req,res) => {
  try{
    const {email,password} = await req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(400).json({message : 'Enter valid Credentials',error:true})
    } 
    const hashedpassword = bcrypt.compare(password,existingUser.password);
    if(!hashedpassword){
        return res.status(400).json({message : 'Enter valid Credentials',error:true})
    } 
    
    const token = await jwt.sign({userId:existingUser._id,username:existingUser.name,profile_pic:existingUser.profile_pic},process.env.SecretKey,{expiresIn:'1d'});
    return res.cookie('token',token).status(200).json({message:'User Login successfully',success:true});
  }catch(error){
    return res.status(500).json({error : true,message : error.message});
  }
}

export default LoginUser;
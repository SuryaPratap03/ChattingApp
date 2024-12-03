import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const CreateUser = async(req,res) => {
  try{
    const {name,email,password,profile_pic} = await req.body;
    const existingUsername = await User.findOne({name});
    if(existingUsername){
        return res.status(400).json({message : 'Username taken already',error:true})
    } 
    const existingUseremail = await User.findOne({email});
    if(existingUseremail){
        return res.status(400).json({message : 'Email taken already',error:true})
    } 
    const hashedpassword = await bcrypt.hash(password,10);
    const newuser = await User({name,email,password:hashedpassword,profile_pic});
    newuser.save();
    const token = await jwt.sign({userId:newuser._id,username:newuser.name,profile_pic:newuser.profile_pic},process.env.SecretKey,{expiresIn:'1d'});
    return res.cookie('token',token).status(200).json({message:'User created successfully',success:true});
  }catch(error){
    return res.status(500).json({error : true,message : error.message});
  }
}

export default CreateUser;
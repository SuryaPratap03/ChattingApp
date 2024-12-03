import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"provide name"],
    },
    email:{
        type:String,
        required:[true,'provide email'],
    },
    password:{
        type:String,
        required:[true,'provide password'],
    },
    profile_pic:{
        type:String,
        default:'',
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;
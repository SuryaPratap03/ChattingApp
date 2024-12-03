import mongoose from "mongoose";
import User from "./UserModel.js";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    receiverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    data:{
        text:{
            type:String,
            default: '',
        },
        attachment:{
            type:String,
            default:''
        },
        attachmentName:{
            type:String,
            default:''
        }
    }
})

export const Message = mongoose.model('Message',messageSchema);

const conversationSchema = new mongoose.Schema(
    {
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message',
        },
      ],
    },
    { timestamps: true }
  );
  
  export const Conversation = mongoose.model('Conversation', conversationSchema);
  

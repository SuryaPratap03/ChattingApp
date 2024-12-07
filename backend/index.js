import express from 'express';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import UserRouter from './routes/UserRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import {createServer} from 'http';
import { Conversation, Message } from './models/ConversationModel.js';

const app = express();
configDotenv();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:`*`,
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  credentials:true,
}));

// creating http server
const httpserver = createServer(app);

//implementing socket.io 
const io = new Server(httpserver,{
    cors : {
        origin:`${process.env.FRONTEND_URL}`,
        methods:['GET','POST'],
        credentials:true,
    }
})

//Mongo DB Connection
mongoose.connect(process.env.MongoDB_URL)
.then(()=>{
    console.log('Database Connected');
})
.catch(error=>{
    console.log('Error connecting Db ',error);
})

app.get('/',(req,res)=>{
    res.send('<h1>Sending data</h1>');
})
 
// making routes here 
app.use('/',UserRouter);

const PORT = process.env.PORT || 3000;

httpserver.listen(PORT,()=>{
    console.log('App listening on PORT',PORT);
})
const userSocketMap = new Map();

io.on('connection', (socket) => {
    console.log('User connected -> ', socket.id);

    // Register user and map socket ID
    socket.on('register', (userId) => {
        try {
            const user = JSON.parse(userId);
            userSocketMap.set(user, socket.id);
            console.log('User registered -> ', user);
        } catch (error) {
            console.error('Error in register:', error);
        }
    });

    // Get all messages from a conversation
    socket.on('getAllMessagesFromConversation', async (data) => {
        try {
            const { senderId, receiverId } = JSON.parse(data);
            const existingConversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            }).populate({
                path: 'messages',
                select: '-_id senderId receiverId data',
            });

            if (existingConversation) {
                const senderSocketId = userSocketMap.get(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit(
                        'allprevMessages',
                        JSON.stringify(existingConversation?.messages)
                    );
                }
            }
        } catch (error) {
            console.error('Error in getAllMessagesFromConversation:', error);
        }
    });

    // Handle new messages
    socket.on('message', async (message) => {
        try {
            const { senderId, receiverId, data } = JSON.parse(message);

            const newMessage = new Message(JSON.parse(message));
            await newMessage.save();
            console.log('New message saved:', newMessage);

            const existingConversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            });

            if (existingConversation) {
                existingConversation.messages.push(newMessage._id);
                await existingConversation.save();
                console.log('Updated existing conversation:', existingConversation);
            } else {
                const newConversation = new Conversation({
                    participants: [senderId, receiverId],
                    messages: [newMessage._id],
                });
                await newConversation.save();
                console.log('Created new conversation:', newConversation);
            }

            const receiverSocketId = userSocketMap.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    'receivedMessage',
                    JSON.parse(message, senderId, receiverId)
                );
            }
        } catch (error) {
            console.error('Error in message event:', error);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        try {
            for (const [userId, id] of userSocketMap.entries()) {
                if (id === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} removed from the map.`);
                    break;
                }
            }
            console.log('User disconnected ->', socket.id);
        } catch (error) {
            console.error('Error in disconnect event:', error);
        }
    });
});

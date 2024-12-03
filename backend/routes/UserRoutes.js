import express from 'express';
import CreateUser from '../controllers/CreateUser.js';
import LoginUser from '../controllers/LoginUser.js';
import UserDetails from '../controllers/DetailsUser.js';
import { UpdateUser } from '../controllers/updateUser.js';
import { LogoutUser } from '../controllers/LogoutUser.js';
import getAllOtherUsers from '../controllers/getAllOtherUsers.js';

const UserRouter = express.Router();

UserRouter.post('/signup',CreateUser);
UserRouter.post('/login',LoginUser);
UserRouter.get('/userDetails',UserDetails);
UserRouter.post('/updateUser',UpdateUser);
UserRouter.post('/logout',LogoutUser);
UserRouter.post('/getAllOtherUsers',getAllOtherUsers);

export default UserRouter;
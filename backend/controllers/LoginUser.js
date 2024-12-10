import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'Enter valid Credentials', error: true });
    }

    const hashedpassword = await bcrypt.compare(password, existingUser.password);
    if (!hashedpassword) {
      return res.status(400).json({ message: 'Enter valid Credentials', error: true });
    }

    const token = await jwt.sign(
      { userId: existingUser._id, username: existingUser.name, profile_pic: existingUser.profile_pic },
      process.env.SecretKey,
      { expiresIn: '1d' }
    );

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .status(200)
      .json({ message: 'User Login successfully', success: true });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

export default LoginUser;

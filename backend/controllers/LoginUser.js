import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return res.status(400).json({ message: 'Enter valid Credentials', error: true });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Enter valid Credentials', error: true });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.name, profile_pic: existingUser.profile_pic },
      process.env.SecretKey,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Set the token as a secure HttpOnly cookie
    return res
      .cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: true,   // Ensures the cookie is only sent over HTTPS
        sameSite: 'None', // Necessary for cross-origin requests
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

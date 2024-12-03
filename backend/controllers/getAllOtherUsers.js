import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const getAllOtherUsers = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided", error: true });
    }

    // Verify the token and extract user details
    const details = await jwt.verify(token, process.env.SecretKey);
    if (!details || !details.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token", error: true });
    }

    // Fetch all users except the one making the request, excluding the password field
    let userArray = await User.find({}).select('-password');

    // Filter out the current user (by userId) from the list
    userArray = userArray.filter(user => user._id.toString() !== details.userId);

    // Return the filtered users
    return res.status(200).json(userArray);
  } catch (error) {
    // Handle errors and respond with a 500 status code
    return res.status(500).json({ message: error.message, error: true });
  }
};

export default getAllOtherUsers;

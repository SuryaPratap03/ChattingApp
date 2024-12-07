import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const UpdateUser = async (req, res) => {
  try {
    const body = req.body; // No need for `await` on req.body as it's not a promise
    const token = req?.cookies?.token; // Access the token from cookies

    // Token validation
    if (!token) {
      return res.status(400).json({ message: 'No token found', error: true });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SecretKey);

    // If the token is invalid or expired
    if (!decodedToken) {
      return res.status(400).json({ message: 'Token expired or invalid', error: true });
    }

    // Extract user ID from the decoded token
    const { userId } = decodedToken;

    // Find the user by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });

    // If user not found
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', error: true });
    }

    // Return updated user info
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // Log error for debugging
    return res.status(500).json({ message: error.message, error: true });
  }
};

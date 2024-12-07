import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const CreateUser = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;

    // Check if username is already taken
    const existingUsername = await User.findOne({ name });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken", error: true });
    }

    // Check if email is already registered
    const existingUseremail = await User.findOne({ email });
    if (existingUseremail) {
      return res.status(400).json({ message: "Email is already registered", error: true });
    }

    // Hash the password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newuser = new User({
      name,
      email,
      password: hashedpassword,
      profile_pic,
    });

    // Save the user
    await newuser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newuser._id, username: newuser.name, profile_pic: newuser.profile_pic },
      process.env.SecretKey,
      { expiresIn: "1d" }
    );

    // Send the token as a cookie
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export default CreateUser;

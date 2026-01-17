import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

const signUp = async (req, res) => {
  try {
    const { fullName, email, phone, password, userType } = req.body;
    if (!fullName || !email || !phone || !password || !userType) {
      return res.status(400).json({ message: "All fields are required." });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User({ fullName, email, phone, password, role: userType });
    await newUser.save();
    return res.status(201).json({
      message: "Signup successful",
      role: newUser.role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }
    const payload = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    }
    const token = generateToken(payload);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
      role: existingUser.role,
      token,
      id:existingUser._id

    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export { signUp, login, logout };

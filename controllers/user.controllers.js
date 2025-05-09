import bcrypt from "bcryptjs";

import UserModel from "../Models/User.model.js";
import generateToken from "../utils/generateToken.js";

// Register Controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, pincode, address, city, state } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
        error: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const generateRandomCode = (length) => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      return Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join("");
    };

    const referralCode = generateRandomCode(6);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      referralCode,
      pincode,
      address,
      city,
      state,
    });

    const savedUser = await newUser.save();

    // ✅ Token Generate karo
    const token = generateToken(savedUser._id);

    // ✅ Send token in cookie or body (choose one)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "User registered successfully",
      success: true,
      error: false,
      data: savedUser,
      token, // Optional: also send in body if needed
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
        error: true,
      });
    }

    // Check user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
        error: true,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      error: false,
      data: user,
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken");

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    console.log("Profile Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

// export const LoginUser = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Validate request fields
//   if (!email || !password) {
//     return next(new Error("Please provide email and password"));
//   }

//   // Find user and include password in the selection
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new Error("User does not exist"));
//   }

//   // Compare passwords
//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     return next(new Error("Invalid credentials"));
//   }

//   const accessToken = sendToken(user._id);

//   // Send authentication token
//   accessToken(res, user, "Welcome back user", 201);
// });
// export const LogoutUser = asyncHandler(async (req, res, next) => {
//   res
//     .status(200)
//     .cookie("token", "", {
//       expires: new Date(0), // Ensures the cookie is removed effectively
//       httpOnly: true, // Improves security by restricting client-side access
//       secure: process.env.NODE_ENV === "production", // Enforces HTTPS in production
//       sameSite: "Strict", // Prevents CSRF attacks
//     })
//     .json({
//       message: "User logged out successfully",
//       success: true,
//     });
// });

// export const GetUserProfile = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select("-password");
//   res.status(200).json({
//     user,
//     success: true,
//   });
// });

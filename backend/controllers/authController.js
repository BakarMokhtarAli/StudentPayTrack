import User from "../models/User.js";
import { JWT_SCRET } from "../config/config.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

import jwt from "jsonwebtoken";
export const signUp = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!confirmPassword) {
    return next(new AppError("Please provide a confirm password field", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    message: "created success!",
    user: newUser,
  });
});

// create login/signIn

export const login = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;

  // Convert email to lowercase
  req.body.email = email.toLowerCase();

  // login with either username or password
  const existingUser = await User.findOne({
    $or: [{ username }, { email: req.body.email }], // Use the lowercase email
  }).select("+password");

  if (
    !existingUser ||
    !(await existingUser.checkPassword(password, existingUser.password))
  ) {
    return next(new AppError("Invalid creadentials", 401));
  }

  const token = jwt.sign({ id: existingUser._id }, JWT_SCRET, {
    expiresIn: "1h",
  }); // Create JWT token
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 3600000), // 1 hour
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
  });
  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    token, // Optionally send the token in the response
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  // Clear the cookie by setting its expiration date to the past
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() - 1000), // Set to a past date to clear the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully!",
  });
});

export const protect = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to access.", 401)
    );
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SCRET);
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser; // Attach user data to request object
    next();
  } catch (err) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }
};

export const restrictToAdmins = (req, res, next) => {
  // Check if the user is an admin
  if (req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action.", 403)
    );
  }
  next();
};

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check if the user is logged in
  if (!req.user) {
    return next(new AppError("You are not logged in!", 401));
  }

  const existingUser = await User.findById(req.user._id).select("+password"); // select password field to update
  // Check if current password is correct
  const isCorrectPassword = await existingUser.checkPassword(
    currentPassword,
    existingUser.password
  );

  if (!isCorrectPassword) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match.", 400));
  }

  // Update password
  existingUser.password = newPassword; // Set the new password
  await existingUser.save(); // Save the user document

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
  });
});

export const updateUserDetails = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  // Check if the user is logged in
  if (!req.user) {
    return next(new AppError("You are not logged in!", 401));
  }

  // Update username and email
  if (username) req.user.username = username;
  if (email) req.user.email = email;

  await req.user.save();

  res.status(200).json({
    status: "success",
    message: "User details updated successfully!",
    data: {
      user: req.user,
    },
  });
});

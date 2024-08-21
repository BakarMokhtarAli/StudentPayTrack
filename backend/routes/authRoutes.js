import express from "express";
import {
  signUp,
  login,
  logoutUser,
  protect,
  getAllUsers,
  restrictToAdmins,
  updatePassword,
  updateUserDetails,
} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", signUp);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logoutUser);

router.get("/users", protect, restrictToAdmins, getAllUsers);

// Update password route
router.patch("/updatePassword", protect, updatePassword);

// Update user details route
router.patch("/updateUserDetails", protect, updateUserDetails);

export default router;

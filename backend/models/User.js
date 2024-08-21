import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"; // Importing validator

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"], // Email validation
  },
  role: {
    type: String,
    enum: ["admin", "teacher"],
    default: "teacher",
    required: true,
  },
  password: { type: String, required: true, select: false },
});

// Pre-save middleware to encrypt the password and validate passwords
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;

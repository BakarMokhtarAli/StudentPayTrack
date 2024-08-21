import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "@/store/loginSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiMiniEye, HiEyeSlash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@/utils/useTitle";

export const Login = () => {
  useTitle("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      console.log(response);
      toast.success(response.data.message || "logged in successfully!");
      // Handle successful login (e.g., dispatch loginSuccess action)
      dispatch(loginSuccess(response.data));
      navigate("/students");
    } catch (error) {
      // Handle error and display toast
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <div className="mb-4">
          <Label htmlFor="username">Email</Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off" // Added to disable autocomplete
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {password.length > 0 &&
                (showPassword ? <HiEyeSlash /> : <HiMiniEye />)}{" "}
              {/* Show/Hide icon */}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

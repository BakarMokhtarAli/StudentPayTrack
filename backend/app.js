import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import AppError from "./utils/AppError.js";
import globalError from "./controllers/errorController.js";

import path from "path";

const _dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// under right routes important
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});

app.use("*", (req, res, next) => {
  const message = `can't find ${req.originalUrl} plese use correct route`;
  next(new AppError(message, 404));
});

app.use(globalError);

export default app;

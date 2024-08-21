import dotenv from "dotenv";

dotenv.config();

export const DbURL = process.env.DATABASE_URL;
export const JWT_SCRET = process.env.JWT_SECRET;

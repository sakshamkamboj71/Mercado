import express, { Request,Response,NextFunction } from "express";
import userRouter from "./routes/userRoutes";
import sellerRouter from "./routes/sellerRoutes";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import { CustomError } from "./types/customError";
dotenv.config();

mongoose
  .connect(process.env.DB_URI || "enterYourDBURI", { dbName: "MarketPlace" })
  .then(() => console.log("MongoDB connected new"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use("/api/user", userRouter);
app.use("/api/seller",sellerRouter);
app.use((err:CustomError,req:Request,res:Response,next:NextFunction) =>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
      success:false,
      statusCode,
      message
  });
});
app.listen(3003, () => {
  console.log("server started");
});

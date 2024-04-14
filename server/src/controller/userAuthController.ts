import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { errorHandler } from "../utils/error";
import { htmlResponse } from "../utils/htmlResponse";
import { transporter } from "../utils/nodemailer";
dotenv.config();

export const regUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });
  try {
    const hello = await newUser.save();

    const verifyLink = hello.email + "*_*" + newUser._id;
    await transporter.sendMail(
      {
        from: "fakesteam26@gmail.com",
        to: newUser.email,
        subject: "verification mail",
        text: "",
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 10px; padding: 20px;">
            <h2 style="text-align: center; color: #333;">Email Verification</h2>
            <p style="text-align: left; color: #333;">Dear User,</p>
            <p style="text-align: left; color: #333;">Welcome to our platform! To complete your registration, please click the link below to verify your email address:</p>
            <p style="text-align: center; margin-top: 30px;"><a href="http://localhost:3003/api/user/verify-email/${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p style="text-align: left; color: #333;">If you didn't sign up for our platform, you can ignore this email.</p>
            <p style="text-align: left; color: #333;">Thanks,<br> Your Company Name</p>
        </div>
    </div>`,
      },
      (error, info) => {
        if (error) {
          return next(
            errorHandler(200, "Not able to send the verification mail")
          );
        }
      }
    );
    //TRY TO MAKE THE VERIFICATION MAIL ASYNC
    return res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    // STATUS CODE GIVING AXIOS ERROR
    return next(errorHandler(200, "The mail entered already exists"));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(req);
  console.log(password);
  try {
    //SAME STATUS CODE ERROR
    const validU = await User.findOne({ email: email });
    if (!validU) return next(errorHandler(200, "wrong credentials"));
    const passCheck = bcrypt.compareSync(password, validU.password);
    if (!passCheck) return next(errorHandler(200, "wrong credentials"));
    const token = jwt.sign(
      { id: validU._id },
      process.env.JWT_SECRET || "haklabaBuptis"
    );
    const { password: pass, ...rest } = validU.toObject() as User;
    if (rest.emailVerified == false) {
      return next(errorHandler(200, "Email has not been verified"));
    }
    return res
      .cookie("Current_User", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    return next(errorHandler(200, "internal server error"));
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const chk = req.params.chk;
    const linkSplit = chk.split("*_*");
    await User.findByIdAndUpdate(
      linkSplit[1],
      { emailVerified: true },
      { new: true }
    );
    res.status(200).send(htmlResponse);
  } catch (error) {
    console.log(error);
  }
};

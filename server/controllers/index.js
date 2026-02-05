import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js"
import jwt from "jsonwebtoken";
import * as validate from "../middleware/validate.js"
import handleValidation from "../middleware/handleValidation.js";

export const signUp = [
  validate.signUp,
  handleValidation,
  async (req, res, next) => {
    const { email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email }});
    if(existingUser) return res.status(409).json({ msg: 'Email in use'});

    try {
      const hashedPass = await bcrypt.hash(password, 10);
      const tempUser = await prisma.user.create({
        data: {
          email,
          passHashed: hashedPass,
        }
      });
      const name = email.split('@')[0] + `${tempUser.id}`;
      const newUser = await prisma.user.update({
        where: {
          id: tempUser.id
        },
        data: {
          name,
        }
      })
      
      const token = jwt.sign(
        { userId: newUser.id, userName: newUser.name }, 
        process.env.SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000
      })

      res.status(201).json({
        user: {
          id: newUser.id,
          name: newUser.name,
        },
        token,
      });
      
    } catch (error) {
      next(error);
    }
  }
]


export const later = async (req, res, next) => {
   const token = jwt.sign(
      { userId: req.user.id, userName: req.user.name }, 
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    });
    res.status(201).json({
       user: {
          id: newUser.id,
          name: newUser.name,
        },
        token,
    });
}

export const signIn = [
  validate.credentials,
  handleValidation,
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email }});
      if(!user) return res.status(401).json({ msg: 'User not found' });
      
      const isMatch = await bcrypt.compare(password, user.passHashed);
      if(!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: user.id, userName: user.name }, process.env.SECRET, { expiresIn: "5d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      });
      res.status(201).json({
        user: {
          id: newUser.id,
          name: newUser.name,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
]


export const logout = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.status(200).json({ msg: 'Logged out successfully' })
}
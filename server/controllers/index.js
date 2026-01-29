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
      const name = email.split('@')[0];
      const newUser = await prisma.user.create({
        data: {
          email,
          passHashed: hashedPass,
          name,
        }
      });
      const token = jwt.sign(
        { userId: newUser.id, userName: newUser.name }, 
        process.env.SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      })

      res.status(201).json({
        user: {
          id: newUser.id,
          name: newUser.name,
        }
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
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    });
    res.status(201).json({
      user: {
        id: req.user.id,
        name: req.user.name,
      }
    });
}

export const signIn = [
  validate.credentials,
  handleValidation,
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email }});
      if(!user) return res.status(404).json({ msg: 'User not found' });
      
      const isMatch = await bcrypt.compare(password, user.passHashed);
      if(!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: user.id, userName: user.name }, process.env.SECRET, { expiresIn: "5d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      });
      res.status(201).json({
        user: {
          id: user.id,
          name: user.name
        }
      });
    } catch (error) {
      next(error);
    }
  }
]

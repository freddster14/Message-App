import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client"
import jwt from "jsonwebtoken";

// add express validator
const signUp = async (req, res, next) => {
  const { email, password } = req.body

  const existingUser = await prisma.user.find({ where: { email }});
  if(existingUser) return res.status(409).json({ msg: 'Email in use'});

  const hashedPass = await bcrypt.hash(password, 10);

  try {
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
      { expiresIn: 1000 * 60 * 10 } // 15min
    );

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name
      },
      token
    });
    
  } catch (error) {
    next(error);
  }
}

// validate & add multer
const update = async (req, res, next) => {
  const { name, bio } = req.body
  const avatarUrl = req.file || "";
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name,
        bio,
        avatarUrl
      },
    });
    const token = jwt.sign({ userId: newUser.id, userName: newUser.name }, process.env.SECRET, { expiresIn: "5d" })
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name
      },
      token
    });
  } catch (error) {
    next(error);
  }
}
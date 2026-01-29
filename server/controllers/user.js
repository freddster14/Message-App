import "dotenv/config";
import { prisma } from "../prisma/client.js"
import jwt from "jsonwebtoken";



export const user = async (req, res, next) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        email: true,
        name: true,
        avatarUrl: true,
        bio: true,
      }
    });
    res.status(200).json({ userData })
  } catch (error) {
    next(error);
  }
}

// validate & add multer
export const update = async (req, res, next) => {
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

    const token = jwt.sign({ userId: user.id, userName: user.name }, process.env.SECRET, { expiresIn: "5d" })
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
      },
    });
  } catch (error) {
    next(error);
  }
}


export const remove = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id }});
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    next(error);
  }
}
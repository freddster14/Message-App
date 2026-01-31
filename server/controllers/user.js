import "dotenv/config";
import { prisma } from "../prisma/client.js"
import jwt from "jsonwebtoken";

export const user = async (req, res, next) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        bio: true,
      }
    });
    if(!user) return res.status(400).json({ msg: "No user"})
    res.status(200).json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio,
    })
  } catch (error) {
    next(error);
  }
}

// validate & add multer & cloudinary
export const update = async (req, res, next) => {
  const { name, bio } = req.body
  const avatarUrl = req.file.originalname.replace(/\.[^/.]+$/, '') || ""; //remove img extension
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

export const search = async (req, res, next) => {
  const { searched } = req.params;
  try {
    const userChatsId = await prisma.chatMember.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        chatId: true,
      }
    });
    console.log(userChatsId)
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: {
            equals: req.user.id
          }
        },
        name: {
          contains: searched,
        },
        AND : {
          chatMemberships: {
            none: {
              chatId: {
                notIn: userChatsId
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
      }
    });
    console.log(users)
    res.status(200).json({ users })
  } catch (error) {
    console.error(error)
  }
}
import { prisma } from "../prisma/client.js";

export const create = async (req, res) => {
  const { chatId, text } = req.body;
  if(text === "") return res.status(400).json({ msg: "Enter message" })
  try {
    const message = await prisma.message.create({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
      },
      data: {
        text,
        authorId: req.user.id,
        chatId: parseInt(chatId),
      },
    });
    await prisma.chatMember.update({
      where: {
        userId: req.user.id,
        chatId: parseInt(chatId),
      },
      data: {
        lastReadMessageId: message.id,
      }
    })
    res.status({ message });
  } catch (error) {
    
  }
}
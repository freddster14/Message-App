import { prisma } from "../prisma/client";

export const create = async (req, res) => {
  const { chatId, text } = req.body;
  
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
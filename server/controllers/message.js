import { prisma } from "../prisma/client.js";

export const create = async (req, res) => {
  const { chatId, text } = req.body;
  try {
    const message = await createMessage(text, parseInt(chatId), req.user.id)
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export const createMessage = async (text, chatId, authorId) => {
  if(text === "") return res.status(400).json({ msg: "Enter message" })
   const message = await prisma.message.create({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
      },
      data: {
        text,
        authorId,
        chatId,
      },
    });
    await prisma.chatMember.update({
      where: {
        userId_chatId: {
          userId: authorId,
          chatId,
        }
      },
      data: {
        lastReadMessageId: message.id,
      }
    })
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        updatedAt: new Date(),
      }
    });
    return message;
}
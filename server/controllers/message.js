import { prisma } from "../prisma/client.js";

export const create = async (req, res) => {
  const { chatId, text } = req.body;
  if(text === "") return res.status(400).json({ msg: "Enter message" })
  try {
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
        authorId: req.user.id,
        chatId: parseInt(chatId),
      },
    });
    await prisma.chatMember.update({
      where: {
        userId_chatId: {
          userId: req.user.id,
          chatId: parseInt(chatId),
        }
      },
      data: {
        lastReadMessageId: message.id,
      }
    })
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}
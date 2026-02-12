import { prisma } from "../prisma/client.js";

export const create = async (req, res) => {
  const { chatId, text } = req.body;
  try {
    if(text === "") return res.status(409).json({ msg: "Enter message" });

    const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) }});
    if(!chat) return res.status(400).json({ msg: 'Chat does not exist'});

    const membership = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: req.user.id,
          chatId: parseInt(chatId),
        },
      },
    })
    if(!membership) return res.status(403).json({ msg: 'Not a member of this chat'})

    const message = await createMessage(text, chat.id, req.user.id)
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Validation should happen before this is ran.
export const createMessage = async (text, chatId, authorId) => {
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
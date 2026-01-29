import { prisma } from "../prisma/client.js";

export const chats = async (req, res, next) => {
  try {
    const chats = await prisma.chatMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        chat: true,
      },
    });
    res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export const chatInfo = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const member = await prisma.chatMember.findUnique({
      where: {
        userId: req.user.id,
        chatId: parseInt(chatId),
      },
    });
    if(!member) return res.status(400).json({ msg: "Access denied" });
    const chat = await prisma.chat.findUnique({
      where: { 
        chatId: parseInt(chatId),
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        },
      },
    });
    
    if(chat.messages[-1].id > member.lastReadMessageId) {
      await prisma.chatMember.update({
        where: {
          userId: req.user.id,
          chatId,
        },
        data: {
          lastReadMessageId: chat.messages[-1].id
        },
      })
    }

    const formattedChat = {
      name: chat.name,
      isGroup: chat.isGroup,
      members: chat.members.map(m => m.user),
      messages: chat.messages,
    }

    res.status(200).json({ chat: formattedChat })
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export const remove = async (req, res) => {
  const { chatId } = req.params;
  try {
    const member = await prisma.chatMember.findUnique({
       where: {
        userId: req.user.id,
        chatId: parseInt(chatId),
      },
    });
    if(!member) return res.status(400).json({ msg: "Access denied" });

    await prisma.chat.delete({ where: { chatId: parseInt(chatId) }});
    res.status(200).json({ msg: "Deleted" }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}
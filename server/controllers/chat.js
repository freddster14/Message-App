import { prisma } from "../prisma/client.js";

export const chats = async (req, res, next) => {
  try {
    const allChats = await prisma.chatMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        chat: {
          include: {
            members: {
              where: {
                userId: {
                  not: req.user.id,
                },
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        chat: {
          updatedAt: 'desc'
        }
      } 

    });
    const formattedChats = allChats.map(c => {
      return {
        id: c.chat.id,
        name: c.chat.name,
        isGroup: c.chat.isGroup,
        members: c.chat.members.map(m => m.user),
        lastReadMessageId: c.lastReadMessageId,
      }
    })
    res.status(200).json({ chats: formattedChats });
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
        userId_chatId: {
          userId: req.user.id,
          chatId: parseInt(chatId),
        }
      },
    });
    if(!member) return res.status(400).json({ msg: "Access denied" });
    const chat = await prisma.chat.findUnique({
      where: { 
        id: parseInt(chatId),
      },
      include: {
        messages: {
          take: 20,
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
          where: {
            userId: {
              not: req.user.id,
            },
          },
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
    //update last read message
    if(chat.messages.length > 0 && chat.messages[0].id > member.lastReadMessageId) {
      await prisma.chatMember.update({
        where: {
          userId_chatId: {
            userId: req.user.id,
            chatId: parseInt(chatId),
          }
        },
        data: {
          lastReadMessageId: chat.messages[chat.messages.length - 1].id
        },
      })
    }

    const formattedChat = {
      id: chat.id,
      name: chat.name,
      isGroup: chat.isGroup,
      members: chat.members.map(m => m.user),
      messages: chat.messages,
      createdAt: chat.createdAt,
    }

    res.status(200).json({ chat: formattedChat })
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export const cursorPagination = async (req, res) => {
  const { chatId, cursor } = req.params;

  try {
    const chat = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: req.user.id,
          chatId: parseInt(chatId),
        }
      },
    });
    if(!chat) return res.status(400).json({ msg: 'No access'});

    const messages = await prisma.message.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        id: {
          lt: parseInt(cursor),
        }
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
    });
    
    res.status(200).json({ messages })
  } catch (error) {
     console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}


//validate ids
export const group = async (req, res) => {
  const { usersId } = req.body;
  try {
    let name = "";
    // Check usersId
    for(let i=0; i < usersId.length; i++) {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(usersId[i]),
        },
        select: {
          name: true,
        }
      });

      if(!user) return res.status(400).json({ msg: "Not all user exists"})

    };

    //Allow creating based on user already having a chat with said usersId <-- missing


    const chat = await prisma.chat.create({
      data: {
        name,
        isGroup: true,
      }
    });

     await prisma.chatMember.create({
        data: {
          userId: req.user.id,
          chatId: chat.id,
        }
      });
    for(let i=0; i < usersId.length; i++) {
      await prisma.chatMember.create({
        data: {
          userId: parseInt(usersId[i]),
          chatId: chat.id,
        }
      });
    };

    res.status(200).json({ msg: "Created" })
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export const add = async (req, res) => {
  const { chatId, usersId } = req.body;

  try {
    const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) }});
    if(!chat) return res.status(400).json({ msg: 'Chat not found' });

    // Check usersId
    for(let i=0; i < usersId.length; i++) {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(usersId[i]),
        },
        select: {
          name: true,
        }
      });

      if(!user) return res.status(400).json({ msg: "Not all user exists"});

      await prisma.chatMember.create({
        data: {
          userId: parseInt(usersId[i]),
          chatId: chat.id,
        }
      });
      
    };

    res.status(200).json({ msg: 'Added' })
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
        userId_chatId: {
          userId: req.user.id,
          chatId: parseInt(chatId),
        }
      },
    });
    if(!member) return res.status(400).json({ msg: "Access denied" });

    await prisma.chatMember.delete({
      where: {
      userId_chatId: {
        userId: req.user.id,
        chatId: parseInt(chatId),
      }
      },
    });

    
    res.status(200).json({ msg: "Deleted" }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}
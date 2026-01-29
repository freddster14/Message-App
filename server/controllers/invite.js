import { prisma } from "../prisma/client.js";

export const create = async (req, res, next) => {
  const { recipientId } = req.body;
  try {
    const recipient = await prisma.user.findUnique({ where: { id: parseInt(recipientId) }});
    if(!recipient) return res.status(200).json({ msg: "User does not exist" });
    await prisma.invite.create({
      data: {
        senderId: req.user.id,
        recipientId: parseInt(recipientId),
      }
    });
    res.status(200).json({ msg: "Sent" });
  } catch (error) {
    next(error);
  }
}

export const received = async (req, res, next) => {
  try {
    const invites = await prisma.invite.findMany({
      where: { 
        recipientId: req.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
    });
    const formattedInvites = invites.map(i => i.sender);
    res.status(200).json({ invites: formattedInvites });
  } catch (error) {
    next(error);
  }
}

export const sent = async (req, res, next) => {
  try {
    const invites = await prisma.invite.findMany({
      where: { senderId: req.user.id },
      include: {
        recipient: {
           select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    });
    const formattedInvites = invites.map(i => i.sender);
    res.status(200).json({ invites: formattedInvites });
  } catch (error) {
    next(error);
  }
}

export const accept = async (req, res, next) => {
  const { senderId } = req.body;
  try {
    const invite = await prisma.invite.findUnique({
       senderId_recipientId: {
          senderId,
          recipientId: req.user.id,
        },
    });
    if(!invite) return res.status(400).json({ msg: 'Invite does not exist' })
    await prisma.invite.delete({
      where: {
        senderId_recipientId: {
          senderId,
          recipientId: req.user.id,
        },
      },
     });
    const chat = await prisma.chat.create();
    await prisma.chatMember.create({
      data: {
        userId: senderId,
        chatId: chat.id
      }
    });
    await prisma.chatMember.create({
     data: {
        userId: req.user.id,
        chatId: chat.id
      },
    });
    res.status(200).json({ msg: "Accepted" })
  } catch (error) {
    next(error);
  }
}

export const decline = async (req, res, next) => {
  const { senderId } = req.body;
  try {
    const invite = await prisma.invite.findUnique({
       senderId_recipientId: {
          senderId,
          recipientId: req.user.id,
        },
    });
    if(!invite) return res.status(400).json({ msg: 'Invite does not exist' })
    await prisma.invite.delete({
      where: {
        senderId_recipientId: {
          senderId,
          recipientId: req.user.id,
        },
      },
    });
    res.status(200).json({ msg: "Declined" })

  } catch (error) {
    next(error); 
  }
  
}

export const remove = async (req, res, next) => {
  const { recipientId } = req.body;
  try {
    const invite = await prisma.invite.findUnique({
       senderId_recipientId: {
          senderId: req.user.id,
          recipientId,
        },
    });
    if(!invite) return res.status(400).json({ msg: 'Invite does not exist' })
    await prisma.invite.delete({
      where: {
        senderId_recipientId: {
          senderId: req.user.id,
          recipientId,
        },
      },
    });
    res.status(200).json({ msg: "Removed" })
  } catch (error) {
    next(error); 
  }
}
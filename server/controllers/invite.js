import { prisma } from "../prisma/client";

export const create = async (req, res, next) => {
  const { recipientId } = req.body;
  try {
    const recipient = await prisma.user.findUnique({ where: { id: recipientId }});
    if(!recipient) return res.status(200).json({ msg: "User does not exist" });
    const invite = await prisma.invite.create({
      data: {
        senderId: req.user.id,
        recipientId,
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
      where: { recipientId: req.user.id },
      include: { sender: true },
    });
    res.status(200).json({ invites });
  } catch (error) {
    next(error);
  }
}

export const sent = async (req, res, next) => {
  try {
    const invites = await prisma.invite.findMany({
      where: { senderId: req.user.id },
      include: {
        recipient: true
      }
    });
    res.status(200).json({ invites });
  } catch (error) {
    next(error);
  }
}

export const accept = async (req, res, next) => {
  const { senderId } = req.body;
  try {
    await prisma.invite.delete({
      where: {
        senderId_recipientId: {
          senderId,
          recipientId: req.user.id,
        },
      },
     });
    const chat = await prisma.chat.create();
    const sender = await prisma.chatMember.create({
      data: {
        userId: senderId,
        chatId: chat.id
      }
    });
    const recipient = await prisma.chatMember.create({
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
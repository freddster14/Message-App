import request from "supertest";
import { beforeAll, describe, expect, jest } from '@jest/globals';

let mockUserValue = { id: 'default-id' };

jest.unstable_mockModule('../middleware/token.js', () => ({
  default: (req, res, next) => {
    req.user = mockUserValue;
    next();
  }
}));

const { app } = await import("../app.js");
const { prisma } = await import("../prisma/client.js");

describe('Chat', () => {
  let user1;
  let user2;
  let user3;
  let chatId;

  beforeAll( async () => {
     // Clean up test entries
    await prisma.chat.deleteMany({
      where: { 
        members: { 
          some: { user: { email: { contains: '@test.com' } } }
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    });
    // Create users
    user1 = await prisma.user.create({
      data: {
        email: 'chat-user1@test.com',
        passHashed: "password123",
      }
    });
    mockUserValue = { id: user1.id}
    user2 = await prisma.user.create({
      data: {
        email: 'chat-user2@test.com',
        passHashed: "password123",
      }
    });
    user3 = await prisma.user.create({
      data: {
        email: 'chat-user3@test.com',
        passHashed: "password123",
      }
    });
    // Create chat with users 1 & 2
    const chat = await prisma.chat.create()
    chatId = chat.id;
    await prisma.chatMember.create({
      data: {
        userId: user1.id,
        chatId: chat.id,
      }
    });
    await prisma.chatMember.create({
      data: {
        userId: user2.id,
        chatId: chat.id,
      }
    })
  });

  afterAll(async () => {
    await prisma.chat.deleteMany({
      where: { 
        members: { 
          some: { user: { email: { contains: '@test.com' } } }
        }
      }
    });
    await prisma.$disconnect()
  });

  // Reset User
  afterEach(() => {
    mockUserValue = { id: user1.id }
  })

  describe('GET /chat', () => {
    it('should return all chats', async () => {
      const res = await request(app)
        .get('/chat')

      expect(res.status).toBe(200); 
      expect(res.body).toHaveProperty('chats');
      expect(res.body.chats[0]).toHaveProperty('id');
      expect(res.body.chats[0]).toHaveProperty('name');
      expect(res.body.chats[0]).toHaveProperty('isGroup');
      expect(res.body.chats[0]).toHaveProperty('members');
      expect(res.body.chats.length).toBe(1);
    });

  });

  describe('GET /chat/info', () => {
    it('should return chat info', async () => {
      const res = await request(app)
        .get(`/chat/${chatId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('chat');
      expect(res.body.chat).toHaveProperty('members');
      expect(res.body.chat.members[0].id).not.toBe(user1.id);
      expect(res.body.chat.members[0].id).toBe(user2.id);
    });

    it('should reject access to info', async () => {
      const res = await request(app)
        .get('/chat/2');

        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('msg')
    });

    it('should update lastReadMessageId', async () => {
      // Send message
      await request(app)
      .post('/message')
      .send({
        chatId,
        text: 'testing message'
      });

      // User2 opens chat info, updating lastReadMessageId
      mockUserValue = { id: user2.id };

      await request(app)
      .get(`/chat/${chatId}`);

      const afterRead = await prisma.chatMember.findUnique({
        where: {
          userId_chatId: {
            userId: user2.id,
            chatId,
          },
        },
        select: {
          lastReadMessageId: true,
        }
        
      });
      expect(afterRead.lastReadMessageId).not.toBeNull();
      expect(afterRead.lastReadMessageId).toBeDefined();
      expect(afterRead.lastReadMessageId).toBeGreaterThan(0);
    })
  })

  describe('GET /chat/:chatId/:cursor', () => {
    // Send 25 messages
    let cursor;
    beforeAll(async () => {
      let messages = [];
      for(let i=0; i < 25; i++) {
          messages.push({
          text: 'test',
          authorId: user1.id,
          chatId,
        })
      }
      await prisma.message.createMany({
        data: messages
      });
      cursor = await prisma.message.findFirst({
         orderBy: {
          id: 'desc'
        },
        skip: 20,
        where: {
          chatId,
        },
       
      });
    });
    
    it('should return 5 new messages', async () => {
      const res = await request(app)
        .get(`/chat/${chatId}/${cursor.id}`)

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('messages');
      expect(res.body.messages.length).toBe(5);
    });

    it('should return no messages invalid cursor', async () => {
      const res = await request(app)
        .get(`/chat/${chatId}/${-1}`)

      expect(res.status).toBe(204);
    });

    it('should reject on invalid id', async () => {
      const res = await request(app)
        .get(`/chat/${-1}/${cursor.id}`)

      expect(res.status).toBe(400);
    })
  })

  describe('POST /chat/group', () => {
    
    it('should create a group chat', async () => {
      const res = await request(app)
        .post('/chat/group')
        .send({ usersId: [user2.id, user3.id] });

      expect(res.status).toBe(201);
    });

    it('should reject with incorrect usersId', async () => {
      const res = await request(app)
        .post('/chat/group')
        .send({ usersId: [-1, user3.id] });

      expect(res.status).toBe(400);
    });
  })

  describe('DELETE /chat', () => {
    it('should delete', async () => {
      await request(app)
        .post('/chat/group')
        .send({ usersId: [user2.id, user3.id] });
      // Get last created chatId
      const memberIds = [user1.id, user2.id, user3.id ]
      const chat = await prisma.chat.findMany({
        where: {
          isGroup: true,
          AND: memberIds.map(userId => ({
            members: { some: { userId } }
          }))
        },
        include: {
          members: { select: { userId: true } }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const res = await request(app)
        .delete(`/chat/${chat[0].id}`);

      expect(res.status).toBe(200);
    });

    it('should reject on invalid data', async () => {
      const res = await request(app)
        .delete(`/chat/${-1}`);
        expect(res.status).toBe(403);
    });

  });
});

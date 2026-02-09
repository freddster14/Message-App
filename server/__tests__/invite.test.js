import request from "supertest";
import { beforeAll, describe, expect, it, jest } from '@jest/globals';

let mockUserValue = { id: 'default-id' };

jest.unstable_mockModule('../middleware/token.js', () => ({
  default: (req, res, next) => {
    req.user = mockUserValue;
    next();
  }
}));

const { app } = await import("../app.js");
const { prisma } = await import("../prisma/client.js");

describe("Invite", () => {
  let user1;
  let user2;

  beforeAll(async () => {
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
        email: 'invite-user1@test.com',
        passHashed: "password123",
      }
    });
    mockUserValue = user1
    user2 = await prisma.user.create({
      data: {
        email: 'invite-user2@test.com',
        passHashed: "password123",
      }
    });
  })

  describe('POST /invite', () => {
    it('should create an invite', async () => {
      const res = await request(app)
        .post('/invite')
        .send({ recipientId: user2.id })
      expect(res.status).toBe(201);
      expect()
    });

    it('should reject on invalid recipientId', async () => {
       const res = await request(app)
        .post('/invite')
        .send({ recipientId: -1 })
      expect(res.status).toBe(400);
    });

    it('should renew invite', async () => {
      const res = await request(app)
        .post('/invite')
        .send({ recipientId: user2.id })
      expect(res.status).toBe(200);
    });
  });

    describe('GET /invite/sent', () => {
    it('should return invites sent', async () => {
      const res = await request(app)
        .get('/invite/sent')

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('invites');
    })
  });

  describe("GET /invite/received", () => {
    it('should return invites received', async () => {
      const res = await request(app)
        .get('/invite/received')

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('invites');
    })
  });

  describe('DELETE /invite/decline', () => {
    beforeAll(async () => {
      await request(app)
        .post('/invite')
        .send({ recipientId: user2.id })
    });

    it('should remove invite on decline', async () => {
      mockUserValue = user2
      const res = await request(app)
        .delete('/invite/decline')
        .send({ senderId: user1.id })
      expect(res.status).toBe(200)
    });

    it('should reject on invalid id', async () => {
      const res = await request(app)
        .delete('/invite/decline')
        .send({ senderId: user2.id })
      expect(res.status).toBe(400)
    })
  });
  describe('DELETE /invite', () => {
    beforeAll(async () => {
      mockUserValue = user1
      await request(app)
        .post('/invite')
        .send({ recipientId: user2.id })
    });

    it('should delete invite', async () => {
      const res = await request(app)
        .delete('/invite')
        .send({ recipientId: user2.id })
      expect(res.status).toBe(200);
    });

    it('should reject on invalid id', async () => {
      const res = await request(app)
        .delete('/invite')
        .send({ recipientId: -1 })
      expect(res.status).toBe(400);
    });
  })

  describe('POST /invite/accept', () => {
    beforeAll(async () => {
      mockUserValue = user1
      await request(app)
        .post('/invite')
        .send({ recipientId: user2.id })
    });
    it('should accept invite', async () => {
      mockUserValue = user2;
      const res = await request(app)
        .post('/invite/accept')
        .send({ senderId: user1.id });
      const user = await prisma.user.findUnique({
        where: { id: user2.id },
        include: {
          receivedInvites: true,
          chatMemberships: true,
        }
      })
      expect(res.status).toBe(200)
      expect(user.receivedInvites.length).toBe(0);
      expect(user.chatMemberships.length).toBe(1);
    });
    it('should reject on invalid invite', async () => {
      const res = await request(app)
        .post('/invite/accept')
        .send({ senderId: -1 });
      expect(res.status).toBe(400);
    });
  })
})
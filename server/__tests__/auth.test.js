import request from "supertest";
import { app }  from "../app.js"
import { prisma } from "../prisma/client.js"


describe("Authorization", () => {

  beforeAll( async () => {
    // Clean up test entries
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    })
  });

  afterAll(async () => {
    await prisma.$disconnect()
  });

  describe('POST /sign-up', () => {

    it('should create new user', async () => {
      const res = await request(app)
        .post('/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password123',
          confirm: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.name).toMatch(/test/);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/sign-up')
        .send({
          email: 'duplicate@test.com',
          password: 'password123',
          confirm: 'password123',
        });

      // Duplicate entry
      const res = await request(app)
        .post('/sign-up')
        .send({
          email: 'duplicate@test.com',
          password: 'password1253',
          confirm: 'password1253',
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('msg');
      expect(res.body.msg).toBe('Email in use');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/sign-up')
        .send({
          email: 'weak@test.com',
          password: 'pa123',
          confirm: 'pa123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg');
    })
  });

  describe('POST /sign-in', () => {

    beforeAll(async () => {
      // Create test user
      await request(app)
        .post('/sign-up')
        .send({
          email: 'login@test.com',
          password: 'password123',
          confirm: 'password123',
        });
    })

    it('should sign in user', async () => {
      const res = await request(app)
        .post('/sign-in')
        .send({
          email: 'login@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('id');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject on wrong password', async () => {
      const res = await request(app)
        .post('/sign-in')
        .send({
          email: 'login@test.com',
          password: 'wrong-password123'
        });

      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('msg')
    });

    it('should reject on user is not registered', async () => {
      const res = await request(app)
        .post('/sign-in')
        .send({
          email: 'nonuser@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('msg')
    });
  })

  describe('GET /user (protected route)', () => {
    let authCookie;

    beforeAll(async () => {
      const res = await request(app)
        .post('/sign-in')
        .send({
          email: 'login@test.com',
          password: 'password123',
        });
      authCookie = res.headers['set-cookie'];
    })

    it('should return user data with valid token', async () => {
      const res = await request(app)
        .get('/user')
        .set('Cookie', authCookie)
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('email', 'login@test.com')
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('avatarUrl')
      expect(res.body).toHaveProperty('bio')
    });

    it('should reject on invalid token', async () => {
      const res = await request(app)
        .get('/user')
        .set('Cookie', "faultyCookie")

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('msg');
    })
  })
})
# Message-App
Full-stack messaging application showcasing WebSocket-based real-time communication, dual authentication strategy for cross-origin security, and cursor-based pagination.
👉 [View deployed app](https://message-app-xi-two.vercel.app/)

## Features

**Real-Time Chats**
- Send and receive messages instantly
- Scroll through conversation history
- Leave conversations at any time

**Connection-Based Messaging**
- Search for users and send chat invitations
- Accept or decline connection requests
- Only message users you've mutually connected with

**Flexible Group Chats**
- Create group chats with your known users
- Add members to existing groups
- Anyone can add members to group chats

## Technical Highlights

**Real time messages with Socket.io**
- Implements room-based broadcasting for chat isolation
- Dual authentication (cookies for REST, tokens for WebSocket)

**CI/CD with Github Actions**
- Automated test on every push
- Branch protection prevents deploying broken code

**Integration Testing**
- 20+ test suite covering authentication, messaging, invites, and group chats
- Automated tests run on every commit via CI/CD

## Quick Start

### Prerequisites
- Node.js
- PostgreSQL database

### Setup
1. Clone and install dependencies
2. Configure environment variables (see `.env.example`)
3. Run database migrations
4. Start backend and frontend

For detailed setup instructions, see [SETUP.md](./SETUP.md)
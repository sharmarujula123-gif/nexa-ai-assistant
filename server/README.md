# Nexa AI Backend 🤖

Backend API for **Nexa AI**, a full-stack AI chat application built with Node.js, Express, MongoDB, and Google Gemini.

## 🚀 Features

* 🔐 JWT authentication
* 👤 User registration & login
* 💬 Persistent conversations
* 🤖 Google Gemini AI integration
* ⚡ Real-time AI response streaming with SSE
* 🗄️ MongoDB database
* 🛡️ Protected API routes
* 🔄 Conversation rename & delete

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT**
* **bcrypt**
* **Google Gemini API**
* **Server-Sent Events (SSE)**

## 📁 Structure

```text
server/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── server.js
└── package.json
```

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Start development server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:8080
```

## 🔑 Main API Routes

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/auth/register`    | Register            |
| POST   | `/api/auth/login`       | Login               |
| GET    | `/api/auth/me`          | Current user        |
| GET    | `/api/threads`          | Get conversations   |
| GET    | `/api/thread/:threadId` | Get conversation    |
| PATCH  | `/api/thread/:threadId` | Rename conversation |
| DELETE | `/api/thread/:threadId` | Delete conversation |
| POST   | `/api/chat`             | Send AI message     |

## 🧠 Architecture

```text
Frontend
   ↓
Express API
   ↓
Authentication
   ↓
MongoDB
   ↓
Gemini AI
   ↓
SSE Streaming
   ↓
Frontend
```
---

**Nexa AI** • Full-stack conversational AI platform

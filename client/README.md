# Nexa AI Frontend

> Modern, responsive React frontend for Nexa AI, a full-stack conversational AI platform with real-time streaming, conversation management, authentication, and a clean ChatGPT-style interface.

## 🚀 Overview

Nexa AI Frontend is built with **React and Vite** and provides the complete user interface for interacting with the Nexa AI backend.

It includes authentication, real-time AI conversations, persistent chat history, Markdown rendering, code highlighting, search, conversation management, and responsive light/dark themes.

---

## ✨ Features

* 💬 Real-time AI conversations
* ⚡ Streaming responses with Server-Sent Events
* 🔐 Login & registration
* 🗂️ Persistent conversation history
* 🔎 Search conversations
* ✏️ Rename conversations
* 🗑️ Delete conversations
* 📝 Markdown & GitHub-Flavored Markdown
* 💻 Syntax-highlighted code blocks
* 📋 Copy AI responses
* 🌙 Dark & light mode
* 📱 Fully responsive UI
* ⏹️ Abort active AI responses
* 🔄 Persistent authentication state
* ⚠️ Loading and error states

---

## 🛠️ Tech Stack

| Technology            | Usage                           |
| --------------------- | ------------------------------- |
| **React**             | UI development                  |
| **Vite**              | Build tool & development server |
| **JavaScript**        | Application logic               |
| **React Context API** | Global state management         |
| **CSS3**              | Styling & responsive design     |
| **React Markdown**    | Markdown rendering              |
| **Remark GFM**        | GitHub-Flavored Markdown        |
| **Highlight.js**      | Code syntax highlighting        |
| **React Spinners**    | Loading states                  |
| **Font Awesome**      | Icons                           |

---

## 🏗️ Architecture

```text id="9t1tqj"
                    Nexa AI Frontend
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Authentication   Chat UI      Sidebar
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    React Context
                           │
                           ▼
                     REST API / SSE
                           │
                           ▼
                    Nexa AI Backend
```

---

## 📁 Project Structure

```text id="g1g0yp"
src/
│
├── assets/
│
├── App.jsx
├── App.css
├── Auth.jsx
│
├── Chat.jsx
├── Chat.css
│
├── ChatWindow.jsx
├── ChatWindow.css
│
├── Sidebar.jsx
├── Sidebar.css
│
├── MyContext.jsx
│
├── index.css
└── main.jsx
```

### Core Components

**`App.jsx`**
Handles application-level state, authentication, themes, and routing between the main application views.

**`Auth.jsx`**
Provides login and registration functionality.

**`ChatWindow.jsx`**
Handles message input, API requests, streaming responses, loading states, and response cancellation.

**`Chat.jsx`**
Renders user and AI messages with Markdown and syntax-highlighted code.

**`Sidebar.jsx`**
Manages conversation history, search, rename, deletion, and creation of new conversations.

**`MyContext.jsx`**
Provides shared application state using React Context.

---

## 🔄 AI Streaming

Nexa AI displays responses progressively using **Server-Sent Events (SSE)**.

```text id="yxw4cf"
User enters message
        │
        ▼
Frontend sends request
        │
        ▼
Nexa AI Backend
        │
        ▼
Gemini generates response
        │
        ▼
SSE token stream
        │
        ▼
Frontend updates message
        │
        ▼
Complete response
```

This creates a responsive, real-time conversational experience instead of waiting for the entire AI response.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env id="4f7wzi"
VITE_API_URL=http://localhost:8080/api
```

For production:

```env id="k0asxw"
VITE_API_URL=https://your-api-domain.com/api
```

> Never expose private API keys in the frontend. Only public configuration such as the backend URL should be stored in Vite environment variables.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash id="e8k2w1"
git clone https://github.com/your-username/nexa-ai-frontend.git
cd nexa-ai-frontend
```

### 2. Install dependencies

```bash id="l2m3pz"
npm install
```

### 3. Configure environment variables

Create:

```text id="v7v3cn"
.env
```

Add:

```env id="o2d3h7"
VITE_API_URL=http://localhost:8080/api
```

### 4. Start the development server

```bash id="3n0d9e"
npm run dev
```

The application will be available at the local URL provided by Vite, typically:

```text id="x0f9ba"
http://localhost:5173
```

---

## 🏭 Production Build

Build the optimized frontend:

```bash id="n1y5fa"
npm run build
```

Preview the production build:

```bash id="v6u1sk"
npm run preview
```

---

## 📱 Responsive Design

The interface is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

On smaller screens, the sidebar transforms into an overlay navigation system while the chat interface remains optimized for mobile use.

---

## 🎨 UI Highlights

* Minimal conversational interface
* Responsive sidebar
* Persistent theme preference
* Smooth loading states
* Clean message bubbles
* Code block formatting
* One-click response copying
* Mobile-friendly navigation
* Empty and error states

---

## 🔗 Backend

This frontend connects to the **Nexa AI Backend**.

```text id="z5a1dk"
Nexa AI Frontend
       │
       │ REST API + SSE
       ▼
Nexa AI Backend
       │
       ├── MongoDB
       │
       └── Google Gemini
```

---

## 🚧 Future Improvements

* 🎙️ Voice input
* 📎 File & image uploads
* 🔄 Regenerate responses
* ✏️ Edit and resend messages
* 📤 Conversation export
* 🔗 Conversation sharing
* ⌨️ Keyboard shortcuts
* 🤖 Multiple AI model selection
* 📊 Usage analytics
* 📱 PWA support

---

## 👨‍💻 Author

**Rujula Sharma**

Full-Stack Developer

`React` · `Node.js` · `Express` · `MongoDB` · `AI Applications`

---

⭐ If you like the project, consider giving the repository a star.

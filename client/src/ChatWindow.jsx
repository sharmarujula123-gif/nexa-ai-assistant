import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    currThreadId,
    setPrevChats,
    setNewChat,
    darkMode,
    setDarkMode,
    sidebarOpen,
    setSidebarOpen,
    token,
    user,
    logout,
    setAllThreads,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [menu, setMenu] = useState(false);
  const abortRef = useRef(null);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const updateAssistantMessage = (content) => {
    setPrevChats((prev) => {
      const next = [...prev];
      const lastIndex = next.length - 1;

      if (lastIndex >= 0 && next[lastIndex]?.role === "assistant") {
        next[lastIndex] = {
          ...next[lastIndex],
          content,
        };
      }

      return next;
    });
  };

  const processSSEEvent = (event, onToken, onDone, onError) => {
    const dataLines = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);

    for (const dataText of dataLines) {
      try {
        const data = JSON.parse(dataText);

        if (data.type === "token" && data.text) {
          onToken(data.text);
        } else if (data.type === "done") {
          onDone(data);
        } else if (data.type === "error") {
          onError(data.error || "Nexa could not answer right now.");
        }
      } catch (parseError) {
        console.error("SSE parse error:", parseError, dataText);
      }
    }
  };

  const getReply = async () => {
    const text = prompt.trim();

    if (!text || loading) return;

    setPrompt("");
    setCharCount(0);
    setNewChat(false);
    setError("");
    setLoading(true);

    setPrevChats((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          message: text,
          threadId: currThreadId,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || "Nexa could not answer right now."
        );
      }

      if (!response.body) {
        throw new Error("Nexa returned an empty response stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let fullReply = "";

      const handleEvent = (event) => {
        processSSEEvent(
          event,
          (tokenText) => {
            fullReply += tokenText;
            updateAssistantMessage(fullReply);
          },
          (data) => {
            if (data.reply && data.reply !== fullReply) {
              fullReply = data.reply;
              updateAssistantMessage(fullReply);
            }

            if (data.title) {
              setAllThreads((threads) => [
                {
                  threadId: currThreadId,
                  title: data.title,
                  updatedAt: new Date().toISOString(),
                },
                ...threads.filter(
                  (thread) => thread.threadId !== currThreadId
                ),
              ]);
            }
          },
          (message) => {
            throw new Error(message);
          }
        );
      };

      while (true) {
        const { value, done } = await reader.read();

        if (value) {
          buffer += decoder.decode(value, { stream: !done });
        }

        // Gemini/server SSE uses blank lines to separate events.
        // Support both Unix and Windows line endings.
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";

        for (const event of events) {
          if (event.trim()) {
            handleEvent(event);
          }
        }

        if (done) break;
      }

      // Flush any final event left without a trailing blank line.
      buffer += decoder.decode();

      if (buffer.trim()) {
        handleEvent(buffer);
      }

      if (!fullReply.trim()) {
        throw new Error(
          "Nexa received no text from Gemini. Please try again."
        );
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Chat error:", e);
        setError(e.message || "Something went wrong.");

        // Remove only the empty assistant placeholder.
        setPrevChats((prev) => {
          if (
            prev.length &&
            prev[prev.length - 1]?.role === "assistant" &&
            !prev[prev.length - 1]?.content
          ) {
            return prev.slice(0, -1);
          }

          return prev;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const newChat = () => {
    setNewChat(true);
    setPrompt("");
    setPrevChats([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const key = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getReply();
    }
  };

  return (
    <div className="chatWindow">
      <header className="navbar">
        <div className="navLeft">
          <button
            className="menuBtn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars" />
          </button>

          <button className="brandButton" onClick={newChat}>
            <span className="miniMark">N</span>
            Nexa AI
          </button>
        </div>

        <div className="navRight">
          <button
            className="themeToggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            <i className={`fa-solid fa-${darkMode ? "sun" : "moon"}`} />
          </button>

          <button
            className="userIconDiv"
            onClick={() => setMenu(!menu)}
          >
            <span className="userIcon">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </button>

          {menu && (
            <div className="dropDown">
              <div className="profileBlock">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>

              <button onClick={() => setDarkMode(!darkMode)}>
                <i className="fa-solid fa-circle-half-stroke" />
                {darkMode ? "Light mode" : "Dark mode"}
              </button>

              <button onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <Chat />

      <div className="statusArea">
        {loading && (
          <div className="loadingContainer">
            <ScaleLoader
              color={darkMode ? "#d06a38" : "#b94f2b"}
              height={16}
            />
            <span>Nexa is thinking…</span>
          </div>
        )}

        {error && (
          <div className="errorMessage">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <textarea
            placeholder="Message Nexa…"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setCharCount(e.target.value.length);
            }}
            onKeyDown={key}
            rows="1"
            disabled={loading}
          />

          <div className="inputActions">
            {charCount > 0 && (
              <span className="charCount">
                {charCount.toLocaleString()}/10,000
              </span>
            )}

            <button
              id="submit"
              onClick={getReply}
              disabled={loading || !prompt.trim()}
              title="Send message"
            >
              <i className="fa-solid fa-arrow-up" />
            </button>
          </div>
        </div>

        <p className="info">
          Nexa can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

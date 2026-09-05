const BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const TIMEOUT =
  Number(process.env.AI_TIMEOUT_MS) || 30000;

const TEMP =
  Number(process.env.AI_TEMPERATURE) || 0.7;

function buildContents(messages) {
  return messages
    .filter(
      (m) =>
        m.content &&
        (m.role === "user" || m.role === "assistant")
    )
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

export async function streamAIResponse(messages, onText) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    const error = new Error(
      "GEMINI_API_KEY is not configured."
    );
    error.statusCode = 500;
    throw error;
  }

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(
      `${BASE}/${encodeURIComponent(
        MODEL
      )}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: buildContents(messages),
          generationConfig: {
            temperature: TEMP,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      const error = new Error(
        data?.error?.message ||
          `Gemini API request failed (${response.status})`
      );

      error.statusCode =
        response.status === 429 ? 429 : 502;

      throw error;
    }

    if (!response.body) {
      const error = new Error(
        "Gemini did not return a response stream."
      );
      error.statusCode = 502;
      throw error;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      // Handle both \n\n and \r\n\r\n SSE separators
      const events = buffer.split(/\r?\n\r?\n/);

      buffer = events.pop() || "";

      for (const event of events) {
        const lines = event.split(/\r?\n/);

        for (const line of lines) {
          if (!line.startsWith("data:")) {
            continue;
          }

          const jsonText = line
            .slice(5)
            .trim();

          if (!jsonText) continue;

          try {
            const data = JSON.parse(jsonText);

            const parts =
              data?.candidates?.[0]?.content?.parts || [];

            const text = parts
              .map((part) => part?.text || "")
              .join("");

            if (text) {
              fullResponse += text;
              onText(text);
            }
          } catch (parseError) {
            console.error(
              "Gemini SSE parse error:",
              parseError
            );
          }
        }
      }
    }

    // Process anything remaining in the buffer
    if (buffer.trim()) {
      const lines = buffer.split(/\r?\n/);

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const jsonText = line
          .slice(5)
          .trim();

        if (!jsonText) continue;

        try {
          const data = JSON.parse(jsonText);

          const parts =
            data?.candidates?.[0]?.content?.parts || [];

          const text = parts
            .map((part) => part?.text || "")
            .join("");

          if (text) {
            fullResponse += text;
            onText(text);
          }
        } catch {
          // Ignore incomplete trailing SSE data
        }
      }
    }

    if (!fullResponse.trim()) {
      console.error(
        "Gemini returned no text.",
        {
          model: MODEL,
          finishReason:
            "Check Gemini response candidates",
        }
      );

      const error = new Error(
        "Gemini returned an empty response. Please try again."
      );

      error.statusCode = 502;
      throw error;
    }

    return fullResponse.trim();
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(
        "Nexa timed out waiting for Gemini. Please try again."
      );

      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const getOpenAIAPIResponse = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.OPENAI_TIMEOUT_MS) || 60_000
  );

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "OpenAI API request failed");
    }

    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("OpenAI returned an empty response");
    }

    return content;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OpenAI request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export default getOpenAIAPIResponse;

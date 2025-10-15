const API_KEY = import.meta.env.VITE_OPENAI_KEY;
const apiEndPoint = "https://openrouter.ai/api/v1/chat/completions";
const apiEndPoint2 = "/api/chat";

//get response from the API
async function streamOpenRouterChat({
  getChunk = "", // Callback to handle each streamed token
  onComplete, // Called when streaming finishes
  chatId = "",
  setChatId,
  messages,

  setChatList,
  setLoading,
  setError,
}) {
  let currentAssistantReply = "";
  let loadingTurnedOff = false; // flag to track if loading is turned off
  setLoading(true);
  setError(false);
  try {
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        // "HTTP-Referer": "http://localhost:3000", // Or your site URL
        // "X-Title": "MyStreamingApp",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free", // Or another model
        stream: true,
        messages: messages,
      }),
    });

    // ✅ Handle HTTP error codes like 400, 500
    if (!response.ok) {
      const errorText = await response.text(); // or use response.json() if it's JSON
      console.error("HTTP Error:", response.status, errorText);
      setLoading(false);
      setError(true);
      return; // exit early
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        onComplete?.();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk
        .split("\n")
        .filter((line) => line.trim().startsWith("data:"));

      for (const line of lines) {
        const jsonStr = line.replace("data: ", "").trim();

        if (jsonStr === "[DONE]") {
          const updatedMessage = [
            ...messages,

            { role: "assistant", content: currentAssistantReply },
          ];
          chatId = chatId || crypto.randomUUID();
          setChatList((prev) => {
            const exisitngId = prev.findIndex((chat) => chat?.id === chatId);

            if (exisitngId !== -1) {
              const updatedList = [...prev];
              updatedList[exisitngId] = updatedMessage;

              localStorage.setItem("chatList", JSON.stringify(updatedList));
              return updatedList;
            } else {
              const updatedMsg = [
                ...prev,
                { id: chatId, messages: updatedMessage },
              ];
              localStorage.setItem("chatList", JSON.stringify(updatedMsg));
              return updatedMsg;
            }
          });

          onComplete?.();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);

          if (!chatId && parsed.id) {
            chatId = parsed?.id;
            setChatId(chatId);
          }
          const token = parsed.choices?.[0]?.delta?.content;
          if (token) {
            if (!loadingTurnedOff) {
              setLoading(false);
            }

            getChunk(token);
            currentAssistantReply += token;
          }
        } catch (err) {
          console.warn("Stream parse error:", err, line);
        }
      }
    }
  } catch (err) {
    console.error("Streaming error:", err);
    setLoading(false);
    setError(true);
  }
}

export default streamOpenRouterChat;

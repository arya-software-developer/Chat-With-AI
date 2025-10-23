const apiEndPoint = "/api/chat";

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
  setCurrentId,
  abortController,
}) {
  let currentAssistantReply = "";
  let loadingTurnedOff = false; // flag to track if loading is turned off
  let isNewChat = false;
  setLoading(true);
  setError(false);
  try {
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
      signal: abortController?.signal,
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

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop(); // last line might be incomplete

      for (const line of lines) {
        if (!line.trim().startsWith("data:")) continue;

        const jsonStr = line.replace("data:", "").trim();

        if (jsonStr === "[DONE]") {
          updateChatStorage(
            messages,
            chatId,
            setChatList,
            currentAssistantReply
          );

          if (isNewChat) {
            setChatId(chatId);
          }

          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);

          if (parsed.error) {
            console.error("API Error:", parsed.error.message);
            setError(true);
            setLoading(false);
            onComplete();
            return;
          }

          if (!chatId && parsed.id) {
            chatId = parsed.id;
            isNewChat = true;
            setCurrentId(chatId);
          }

          const token = parsed.choices?.[0]?.delta?.content;
          if (token) {
            if (!loadingTurnedOff) {
              setLoading(false);
              loadingTurnedOff = true;
            }

            getChunk(token);
            currentAssistantReply += token;
          }
        } catch (err) {
          // JSON.parse failed, malformed chunk
          console.warn("Stream parse error:", err, line);
          setLoading(false);
          setError(true);
        }
      }
    }
  } catch (err) {
    if (err.name === "AbortError") {
      updateChatStorage(messages, chatId, setChatList, currentAssistantReply);
    } else {
      console.error("Streaming error:", err);
      setLoading(false);
      setError(true);
    }
  }
}

function updateChatStorage(
  messages,
  chatId = "",
  setChatList,
  currentAssistantReply
) {
  const updatedMessage = [
    ...messages,

    { role: "assistant", content: currentAssistantReply },
  ];
  chatId = chatId || crypto.randomUUID();
  setChatList((prev) => {
    const exisitngId = prev.findIndex((chat) => chat?.id === chatId);

    if (exisitngId !== -1) {
      const updatedList = [...prev];
      updatedList[exisitngId] = {
        id: chatId,
        messages: updatedMessage,
      };

      localStorage.setItem("chatList", JSON.stringify(updatedList));
      return updatedList;
    } else {
      const updatedMsg = [...prev, { id: chatId, messages: updatedMessage }];

      localStorage.setItem("chatList", JSON.stringify(updatedMsg));
      return updatedMsg;
    }
  });
}

export default streamOpenRouterChat;

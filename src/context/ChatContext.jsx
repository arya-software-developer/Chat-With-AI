import { createContext, useState } from "react";
import runChatStreamSession from "../config/gemini";

export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChatObject, setCurrentChatObject] = useState(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const [chatList, setChatList] = useState(null);

  function getChunk(text) {
    setResponse((prev) => {
      const length = prev.length > 1 ? prev.length - 1 : 0;
      const isModelResponse = length > 0 && prev[length]?.role === "model";
      if (isModelResponse) {
        prev[length].parts[0].text = prev[length]?.parts[0]?.text + text;
        return [...prev];
      }
      return [...prev, { role: "model", parts: [{ text }] }];
    });
  }

  const onSent = async () => {
    setResponse((response) => [
      ...response,
      { role: "user", parts: [{ text: userInput }] },
    ]);
    setUserInput("");

    await runChatStreamSession(
      userInput,
      getChunk,
      currentChatObject,
      setIsNewChat,
      setCurrentChatObject,
      setLoading
    );
  };

  const chatContext = {
    userInput,
    setUserInput,
    response,
    setResponse,
    loading,
    setLoading,
    onSent,
    currentChatObject,
    setCurrentChatObject,
    chatList,
    setChatList,
  };
  return (
    <ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
  );
};

export default ChatContextProvider;

import { createContext, useState } from "react";

import streamOpenRouterChat from "../config/openai";
export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [userInput, setUserInput] = useState("");
  const [currentChat, setCurrentChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isNewChat, setIsNewChat] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [error, setError] = useState(false);

  //update chat based on stramed response
  function getChunk(text) {
    setCurrentChat((prev) => {
      const length = prev.length > 1 ? prev.length - 1 : 0;
      const isModelResponse = length > 0 && prev[length]?.role === "assistant";
      if (isModelResponse) {
        prev[length].content = prev[length]?.content + text;

        return [...prev];
      }

      return [...prev, { role: "assistant", content: text }];
    });
  }

  function onComplete() {
    console.log("Finished");
  }

  function onNewChat() {
    setCurrentChat([]);

    setChatId("");
  }

  const onSent = async () => {
    //get all messges from the chat
    let messages = [...currentChat, { role: "user", content: userInput }];
    setCurrentChat((response) => {
      return [...response, { role: "user", content: userInput }];
    });
    setUserInput("");
    await streamOpenRouterChat({
      getChunk,
      onComplete,
      chatId,
      setChatId,
      messages,
      setChatList,
      setLoading,
      setError,
    });
  };

  const chatContext = {
    userInput,
    setUserInput,
    currentChat,
    setCurrentChat,
    loading,
    setLoading,
    onSent,
    chatList,
    setChatList,
    chatId,
    setChatId,
    onNewChat,
    error,
    setError,
  };
  return (
    <ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
  );
};

export default ChatContextProvider;

import { createContext, useRef, useState } from "react";

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
  const [currentId, setCurrentId] = useState(null);

  const allowStreamingUpdateRef = useRef(true);
  const abortControllerRef = useRef(null);

  //update chat based on stramed response
  function getChunk(text) {
    if (allowStreamingUpdateRef.current) {
      setCurrentChat((prev) => {
        const length = prev.length > 1 ? prev.length - 1 : 0;
        const isModelResponse =
          length > 0 && prev[length]?.role === "assistant";
        if (isModelResponse) {
          prev[length].content = prev[length]?.content + text;

          return [...prev];
        }

        return [...prev, { role: "assistant", content: text }];
      });
    }
  }

  function onComplete() {
    console.log("Finished");
  }

  function onNewChat() {
    //cancel on going  chat  api request
    if (abortControllerRef?.current) {
      abortControllerRef.current?.abort();
    }
    allowStreamingUpdateRef.current = false;
    setCurrentChat([]);

    setChatId("");
  }

  const onSent = async () => {
    //cancel on going fetch on sent
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // cancel any ongoing fetch first
    }
    abortControllerRef.current = new AbortController();

    allowStreamingUpdateRef.current = true;
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
      setCurrentId,
      abortController: abortControllerRef.current,
    });
  };

  function stopChat() {}

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

    stopChat,
    allowStreamingUpdateRef,
    currentId,
    setCurrentId,
  };
  return (
    <ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
  );
};

export default ChatContextProvider;

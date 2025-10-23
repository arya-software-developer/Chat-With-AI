import sendIcon from "../../assets/send-icon.png";
import { useContext, useEffect } from "react";

import { ChatContext } from "../../context/ChatContext";
import ChatMessage from "./ChatMessage";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

export default function Main() {
  const {
    userInput,
    setUserInput,
    currentChat,
    setCurrentChat,
    onSent,
    loading,
    error,
    chatId,
    setChatId,
    allowStreamingUpdateRef,
  } = useContext(ChatContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentChatData = useLoaderData();

  useEffect(() => {
    //if new chat prevent triggerign changes based on id and chatId
    if (!allowStreamingUpdateRef.current) {
      return;
    }

    //update path with chatId for new chat
    if (!id && !!chatId) {
      navigate(`/${chatId}`);
      return;
    }

    //if navigate to another chat update chat data
    if (id !== chatId && id) {
      if (currentChatData?.messages) {
        setChatId(id);
        setCurrentChat(currentChatData?.messages);
      } else {
        navigate("/");
      }
    }
  }, [chatId, id]);

  useEffect(() => {
    if (!id) {
      if (currentChat?.length) {
        setCurrentChat([]);
      }

      if (chatId) {
        setChatId(null);
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-start relative h-dvh text-[14px]">
      <div className=" m-2 text-xl  text-gray-500 sticky top-0">
        Chat with AI
      </div>
      {/* show chat message if any */}
      {currentChat?.length > 0 ? (
        <div className="w-full h-full overflow-y-auto max-w-[100%] mx-auto md:max-w-[85%] font-light *:leading-[28px] px-5 md:px-10 ">
          {currentChat.map((chat, index) => {
            const isLast = index == currentChat.length - 1;
            return (
              <ChatMessage
                key={index}
                role={chat?.role}
                text={chat?.content}
                loading={loading && isLast}
                error={error && isLast}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto  text-center flex justify-center items-center text-2xl md:text-3xl  bg-gradient-to-br from-blue-400 from-40%  to-pink-600 bg-clip-text text-transparent flex-1">
          <div>
            <p>Hello,</p>
            <p>How can I help you today?</p>
          </div>
        </div>
      )}
      <div className="shrink-0 bottom-[20px]  w-full  max-w-[80%]  mx-auto py-5  ">
        <div className="flex flex-row bg-gray-50 py-2 px-3 rounded-4xl border-gray-200 border-2">
          <textarea
            type="text"
            placeholder="Enter your query"
            className=" outline-0 border-0 text-gray-800 font-light flex-1 min-h-lh max-h-[10lh] field-sizing-content resize-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button className="w-5 cursor-pointer " onClick={onSent}>
            <img src={sendIcon} alt="send-button" />
          </button>
        </div>

        <p className="text-[12px] text-gray-400 text-center">
          Chat with AI can make mistakes, so double-check it.
        </p>
      </div>
    </div>
  );
}

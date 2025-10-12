import ReactMarkdown from "react-markdown";

const ChatMessage = ({ role, text, loading }) => {
  const isUser = role === "user";

  return isUser ? (
    <>
      <div className="flex justify-end w-full ">
        <div className="bg-blue-50 w-fit rounded p-2 mb-3 mt-13">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col w-full gap-2">
          <div className="bg-linear-to-r from-blue-200 to-pink-100 h-4 animate-pulse delay-100 rounded"></div>
          <div className="bg-linear-to-r from-blue-200 to-pink-100 h-4 animate-pulse delay-200 rounded"></div>
          <div className="bg-linear-to-r from-blue-200 to-pink-100 h-4 animate-pulse delay-300 rounded"></div>
        </div>
      )}
    </>
  ) : (
    <ReactMarkdown>{text}</ReactMarkdown>
  );
};

export default ChatMessage;

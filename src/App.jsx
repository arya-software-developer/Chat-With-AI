import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import { useContext, useEffect } from "react";
import { ChatContext } from "./context/ChatContext";

function App() {
  const { setChatList } = useContext(ChatContext);

  useEffect(() => {
    const chatArray = localStorage.getItem("chatList");

    chatArray ? setChatList(JSON.parse(chatArray)) : setChatList([]);
  }, []);

  return (
    <div className="flex flex-row justify-start">
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;

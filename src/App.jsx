import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
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
      <Outlet></Outlet>
    </div>
  );
}

export default App;

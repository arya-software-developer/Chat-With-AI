import menu from "../../assets/menu-icon.png";
import settingsIcon from "../../assets/setting-icon.png";
import plusIcon from "../../assets/plus-icon.png";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

export default function Sidebar() {
  const { chatList, onNewChat } = useContext(ChatContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  function toggleMenuBar() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <>
      <div
        className={`flex flex-col w-full items-start justify-between h-screen py-6  px-5 bg-blue-50 text-sm   ${
          isMenuOpen ? "max-w-[200px]" : "max-w-fit"
        } `}
      >
        <div className="flex flex-col gap-14 items-start justify-center">
          <img
            src={menu}
            alt="menu"
            className="sidebar-icon cursor-pointer block"
            onClick={toggleMenuBar}
          />

          <div
            className="sidebar-item rounded-2xl bg-blue-100 py-1 px-2 "
            onClick={onNewChat}
          >
            <img src={plusIcon} alt="New Chat" className="sidebar-icon" />
            {isMenuOpen && <span>New Chat</span>}
          </div>

          <div className="overflow-y-auto h-[calc(100vh-400px)]">
            {isMenuOpen && <p className="font-medium  mb-3">Recent Chats</p>}
            {chatList &&
              isMenuOpen &&
              chatList.map((chat) => {
                return (
                  <div
                    className="truncate max-w-[150px]  font-light my-2"
                    key={chat?.id}
                  >
                    {chat?.messages[0]?.content}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="sidebar-item h-1/12">
          <img
            src={settingsIcon}
            alt="Settings icon"
            className="sidebar-icon"
          />
          {isMenuOpen && <span>Settings</span>}
        </div>
      </div>
    </>
  );
}

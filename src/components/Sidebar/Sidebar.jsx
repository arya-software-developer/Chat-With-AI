import menu from "../../assets/menu-icon.png";
import settingsIcon from "../../assets/setting-icon.png";
import plusIcon from "../../assets/plus-icon.png";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

export default function Sidebar() {
  const { chatList } = useContext(ChatContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  function toggleMenuBar() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <>
      <div className="flex flex-col items-start justify-evenly h-screen gap-48 py-6  px-5 bg-blue-50 text-sm">
        <div className="flex flex-col gap-14 items-start justify-center">
          <img
            src={menu}
            alt="menu"
            className="sidebar-icon cursor-pointer block"
            onClick={toggleMenuBar}
          />

          <div className="sidebar-item rounded-2xl bg-blue-100 py-1 px-2 ">
            <img src={plusIcon} alt="New Chat" className="sidebar-icon" />
            {isMenuOpen && <span>New Chat</span>}
          </div>

          <div>
            {isMenuOpen && <p>Recent Chats</p>}
            {chatList &&
              chatList.map((chat) => {
                <div>{chat?.history}</div>;
              })}
            <div className="recent-chats">
              <div>chat</div>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-end items-start">
          <div className="sidebar-item">
            <img
              src={settingsIcon}
              alt="Settings icon"
              className="sidebar-icon"
            />
            {isMenuOpen && <span>Settings</span>}
          </div>
        </div>
      </div>
    </>
  );
}

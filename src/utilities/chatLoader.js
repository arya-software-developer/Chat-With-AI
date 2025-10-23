import { redirect } from "react-router-dom";

/** 
 * 
 * 
 * 
loader function to fetch chat data from local storage based on id if any

@param {Object} Object.params -> url param to fetch id
**/

export function chatLoader({ params }) {
  const { id } = params;
  let currentChatData;

  const chatList = localStorage?.getItem("chatList");
  if (chatList) {
    const chatArray = JSON.parse(chatList);

    currentChatData = chatArray.find((chat) => chat?.id === id);
  }
  if (currentChatData) {
    return currentChatData;
  } else {
    throw redirect("/");
  }
}

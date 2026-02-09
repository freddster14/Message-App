import { useState } from "react";
import apiFetch from "../api/client";
import { socket } from "../socket";

export default function AllChats(props) {
  const [prev, setPrev] = useState(null);

  const openChat = async (chatId) => {
    if(prev === chatId) return;
    if(prev)  socket.emit("leave_chat", prev);
    try {
      socket.emit('join_chat', chatId)
      const data = await apiFetch(`/chat/${chatId}`)
      props.setChat(data.chat);
    } catch (error) {
      console.error(error);
    } finally {
      setPrev(chatId)
    }
  }

  return (
    <div>
      {props.chats.map(c => {
        if(!c.isGroup) {
          return (
            <div key={"c" + c.id} onClick={() => openChat(c.id)}>
              {c.members[0].avatarUrl === null
              ? <div className="default-avatar">{c.members[0].name[0]}</div>
              : <img src={c.members[0].avatarUrl} alt={c.members[0].name} />
              }
              <p>{c.members[0].name}</p>
            </div>
          )
        } else {
          let name = c.name;
          if(!c.name) {
            name = "";
            for(let n of c.members) {
              n === c.members[c.members.length - 1] 
                ? name += n.name 
                : name += `${n.name}, `
            }
          }
          return (
            <div key={"c" + c.id} onClick={() => openChat(c.id)}>
              <p>Group img</p>
              <p>{name}</p>
            </div>
          )
        }
      })}  

    </div>
  )
}
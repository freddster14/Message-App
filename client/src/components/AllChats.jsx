import { useState } from "react";
import apiFetch from "../api/client";
import { socket } from "../socket";
import Error from "../pages/Error";

export default function AllChats(props) {
  const [prev, setPrev] = useState(null);
  const [error ,setError] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  const openChat = async (chatId) => {
    if(prev === chatId) return;
    if(isSubmit) return;
    setIsSubmit(true);
    if(prev)  socket.emit("leave_chat", prev);
    setError()
    try {
      socket.emit('join_chat', chatId)
      const data = await apiFetch(`/chat/${chatId}`)
      props.setChat(data.chat);
      setPrev(chatId)
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <div>
      { error && <Error setError={setError} error={error} style={'modal'}/> }
      { props.chats.length > 0
        ? props.chats.map(c => {
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
        })
      : <div>Invite people or accept invites to get chatting!</div>
      }  

    </div>
  )
}
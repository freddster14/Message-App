import { useState } from "react";
import apiFetch from "../api/client";
import { socket } from "../socket";
import Error from "../pages/Error";
import { colorFor, initialsFor } from "../utils/avatar";
import styles from "../styles/Chat.module.css"

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
    setPrev(chatId)
    props.setChatLoading(true)
    try {
      socket.emit('join_chat', chatId)
      const data = await apiFetch(`/chat/${chatId}`)
      props.setChat(data.chat);
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmit(false)
      props.setChatLoading(false)
    }
  }

  return (
    <div className={styles.allChats}>
      { error && <Error setError={setError} error={error} style={'modal'}/> }
      <div className={styles.chatsLabel}>Chats</div>
      { props.chats.length > 0
        ? props.chats.map(c => {
          const isActive = prev === c.id;
          if(!c.isGroup) {
            const member = c.members[0];
            return (
              <div key={"c" + c.id} onClick={() => openChat(c.id)} className={`${styles.chat} ${isActive ? styles.active : ''}`}>
                {member.avatarUrl === null
                ? <div className={styles.defaultAvatar} style={{ background: colorFor(member.name) }}>{initialsFor(member.name)}</div>
                : <div className={styles.defaultAvatar}><img src={member.avatarUrl} alt={member.name} /></div>
                }
                <div className={styles.chatMeta}>
                  <div className={styles.chatName}>{member.name}</div>
                </div>
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
              <div key={"c" + c.id} onClick={() => openChat(c.id)} className={`${styles.chat} ${isActive ? styles.active : ''}`}>
                <div className={styles.defaultAvatar} style={{ background: 'var(--accent)' }}>GC</div>
                <div className={styles.chatMeta}>
                  <div className={styles.chatName}>{name}</div>
                </div>
              </div>
            )
          }
        })
      : <div className={styles.emptyChats}>Invite people or accept invites to get chatting!</div>
      }

    </div>
  )
}

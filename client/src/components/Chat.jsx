import { useState } from "react";
import apiFetch from "../api/client";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket";
import { useEffect } from "react";
import SearchChats from "./SearchChats";

export default function Chat({ chat, chats, newMessages, setNewMessages}) {
  const { user } = useAuth();
  const[message, setMessage] = useState("");  
  const [error, setError] = useState("")
  const [leftChat, setLeftChat] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {  
    const handleNewMessage = (data) => {
      setNewMessages(prev => [...prev, data.message]);
    };
    
    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [setNewMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const formattedMessage = {
      author: { id: user.id, name: user.name },
      id: `new${newMessages.length}`,
      text: message,
    };
    const temp = { messages: [...newMessages], message};
    setNewMessages( prev => [...prev, formattedMessage])
    setMessage("")
    setError("")
    if(socket.active) {
      socket.emit('send_message', message, chat.id);
    } else {
      try {
        const options = {
          method: 'POST',
          body: JSON.stringify({chatId: chat.id, text: message})
        }
        await apiFetch('/message', options)
      } catch (error) {
        setNewMessages([...temp.messages])
        setMessage(temp.message);
        console.error(error);
        setError("Could not send try again")
      }
    }
  }

  const handleLeave = async (e) => {
    try {
      await apiFetch(`/chat/leave/${chat.id}`, { method: "POST" });
      setLeftChat(true)
    } catch (error) {
      setError(error.message)
    }
  }

  // const handleAdd =  async (e) => {
  //   e.preventDefault();
  //   try {
  //     const options = {
  //       method: "POST",
  //       body: JSON.stringify({ chatId: chat.id, usersId: selectedUsers })
  //     }
  //     await apiFetch('/chat/add', options)
  //   } catch (error) {
  //     setError(error)
  //   }
  // }
 
  return (
    <>
      {chat ? (
        <div>
          <div>
            <h2>Chat Name: {chat.name || chat.members[0].name}</h2>
            {!leftChat && <button onClick={handleLeave}>Leave Chat</button>}
            {/* <button onClick={() => setAddUser(prev => !prev)}>Add user</button>
            {addUser && 
              <SearchChats chats={chats} handleSubmit={handleAdd} setSelectedUsers={setSelectedUsers} error={error}/>
            } */}
          </div>
          <div>
            {chat.messages.map(m => (
              <div key={m.id}>
                <p><strong>{m.author.name}:</strong> {m.text}</p>
              </div>
            ))}
            {newMessages.map(m => 
              (
              <div key={m.id}>
                <p><strong>{m.author.name}:</strong> {m.text}</p>
              </div>
              )
            )}
          </div>
          <p>{error}</p>
          {!leftChat 
            ?  <form onSubmit={sendMessage}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
              </form>
            : <div>You left the chat. Chat will delete on exit!</div>
          }
        </div>
      ) : (
        <div>Please select a chat to view messages.</div>
      )} 
    </>
  )

}
import { useState } from "react";
import apiFetch from "../api/client";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket";
import { useEffect } from "react";
import SearchChats from "./SearchChats";
import { useChats } from "../context/ChatProvider";
import AddUser from "./AddUser";

export default function Chat({ chat }) {
  const { user } = useAuth();
  const { setRefreshTrigger } = useChats();
  const [error, setError] = useState("");
  const [leftChat, setLeftChat] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {  
    const handleNewMessage = (data) => {
      setNewMessages(prev => [...prev, data.message]);
    };
    
    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [setNewMessages]);

  useEffect(() => {
    function reset() {
      setMessage("");
      setNewMessages([]);
      setLeftChat(false);
    }
    reset()
  }, [chat])
  

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

  const handleLeave = async () => {
    try {
      await apiFetch(`/chat/leave/${chat.id}`, { method: "POST" });
      setLeftChat(true);
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setError(error.message)
    }
  }
 
  return (
    <>
      {chat ? (
        <div>
          <div>
            <h2>Chat Name: {chat.name || chat.members[0].name}</h2>
            {!leftChat && <button onClick={handleLeave}>Leave Chat</button>}
            { chat.isGroup && <AddUser chat={chat}/>}
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
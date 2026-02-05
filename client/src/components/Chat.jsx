import { useState } from "react";
import apiFetch from "../api/client";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket";
import { useEffect } from "react";

export default function Chat({ chat, newMessages, setNewMessages}) {
  const { user } = useAuth();
  const[message, setMessage] = useState("");  
  const [error, setError] = useState("")

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

 useEffect(() => {  
  const handleNewMessage = (data) => {
    setNewMessages(prev => [...prev, data.message]);
  };
  
  socket.on('new_message', handleNewMessage);
  
  return () => {
    socket.off('new_message', handleNewMessage);
  };
}, [setNewMessages]);
 
  return (
    <>
      {chat ? (
        <div>
          <h2>Chat Name: {chat.name || chat.members[0].name}</h2>
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
          <form onSubmit={sendMessage}>
             <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
          </form>
         
        </div>
        
      ) : (
        <div>Please select a chat to view messages.</div>
      )} 
    </>
  )

}
import { useState } from "react";
import apiFetch from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Chat(props) {
  const { user } = useAuth();
  const[newMessages, setNewMessages] = useState([]);
  const[message, setMessage] = useState("");  
  const [error, setError] = useState("")

  const sendMessage = async () => {
    const temp = { messages: [...newMessages], message};
    setMessage("");
    setError("")
    setNewMessages([...newMessages, {message, error: false}]);
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({chatId: props.chat.id, text: message})
      }
      await apiFetch('/message', options)
    } catch (error) {
      setNewMessages([...temp.messages])
      setMessage(temp.message);
      console.error(error);
      setError("Could not send try again")
    }
  }
  return (
    <>
      {props.chat ? (
        <div>
          <h2>Chat Name: {props.chat.name || props.chat.members[0].name}</h2>
          <div>
            {props.chat.messages.map(m => (
              <div key={m.id}>
                <p><strong>{m.author.name}:</strong> {m.text}</p>
              </div>
            ))}
            {newMessages.map((m, i) => 
              (
              <div key={i + "m"}>
                <p><strong>{user.name}:</strong> {m.message}</p>
              </div>
              )
            )}
          </div>
          <p>{error}</p>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
        
      ) : (
        <div>Please select a chat to view messages.</div>
      )} 
    </>
  )

}
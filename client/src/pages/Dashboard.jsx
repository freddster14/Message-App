import apiFetch from "../api/client";
import AllChats from "../components/AllChats";
import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useChats } from "../context/ChatProvider";
import { socket } from "../socket";
import styles from '../styles/Dashboard.module.css'
import Error from "./Error";

export default function Dashboard() {
  const { refreshTrigger } = useChats();
  const [chats, setChats] = useState("load");
  const [chat, setChat] = useState();
  const [error, setError] = useState()

  useEffect(() => { 
    async function fetchChats() {
      try {
        const res = await apiFetch('/chat');
        setChats(res.chats);
      } catch (error) {
        setError(error)
      }
    }
    fetchChats();
  }, [refreshTrigger]);

  useEffect(() => {
    socket.connect();
  
    return () => {
      socket.disconnect();
    }
  }, []);

  if(error) {
    return <Error error={error}/>
  }

  if (chats === "load") {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
      <AllChats chats={chats} setChat={setChat}  />
      {chat ? <Chat chat={chat} setChat={setChat} />
      : <div>Select a chat to view messages</div>  
    }
    </div>
  )
}
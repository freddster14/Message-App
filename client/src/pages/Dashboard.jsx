import apiFetch from "../api/client";
import AllChats from "../components/AllChats";
import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useChats } from "../context/ChatProvider";
import { socket } from "../socket";
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const { refreshTrigger } = useChats();
  const [data, setData] = useState();
  const [chat, setChat] = useState();

  useEffect(() => { 
    async function fetchChats() {
      try {
        const res = await apiFetch('/chat');
        setData(res);
      } catch (error) {
        console.error(error);
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
      <AllChats chats={data.chats} setChat={setChat}  />
      <Chat chat={chat} setChat={setChat} />
    </div>
  )
}
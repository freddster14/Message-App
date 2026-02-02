import apiFetch from "../api/client";
import AllChats from "../components/AllChats";
import Chat from "../components/Chat";
import { useEffect, useState } from "react";
import { useChats } from "../context/ChatProvider";

export default function Dashboard() {
  const { refreshTrigger } = useChats();
  const [data, setData] = useState();
  const [chat, setChat] = useState();

  useEffect(() => { 
    async function fetchData() {
      try {
        const res = await apiFetch('/chat');
        setData(res);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [refreshTrigger]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AllChats chats={data.chats} setChat={setChat} />
      <Chat chat={chat} />
    </>
  )
}
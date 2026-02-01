import apiFetch from "../api/client";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState();

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
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Chat chats={data.chats}/>
      <h2>chat messaes</h2>
    </>
  )
}
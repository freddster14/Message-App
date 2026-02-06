import { useEffect, useState } from "react"
import apiFetch from "../api/client";
import { useChats } from "../context/ChatProvider";
import SearchChats from "./SearchChats";

export default function NewGroupChat() {
  const { setRefreshTrigger } = useChats();
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await apiFetch('/chat');
        setData(res.chats);
      } catch (error) {
        setError(error.message)
      }
    };
    fetchChats();
  }, [])

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(selectedUsers.length < 2) {
      setError("Select at least two users");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ usersId: selectedUsers})
      }
      await apiFetch('/chat/group', options);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      setError(error.message)
    }
  }
  if(!data) return null;
  return (
      <SearchChats
        chats={data}
        handleSubmit={handleSubmit}
        setSelectedUsers={setSelectedUsers}
        error={error}
      />
    
  )
}
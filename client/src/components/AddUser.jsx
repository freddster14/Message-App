import {  useState } from "react";
import apiFetch from "../api/client";
import { useChats } from "../context/ChatProvider";
import SearchData from "./SearchChats";

export default function AddUser({ chat, setChat, setError }) {
  const { setRefreshTrigger } = useChats()
  const [active, setActive] = useState(false);
  const [filtered, setFiltered] = useState([])
  const [users, setUsers] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])

  const handleSelect = (e) => {
    setSelectedUsers(prev => 
    prev.includes(e.target.value)
      ? prev.filter(id => id !== e.target.value)  // Remove
      : [...prev, e.target.value]                  // Add
  );
  }

   const handleAdd =  async (e) => {
    e.preventDefault();
    setActive(false);
    if(selectedUsers.length < 1) {
      setError("No users selected")
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ chatId: chat.id, usersId: selectedUsers })
      }
      await apiFetch('/chat/add', options);
      const data = await apiFetch(`/chat/${chat.id}`)
      setChat(data.chat)
      setRefreshTrigger(prev => prev + 1);
      setSelectedUsers([])
    } catch (error) {
      setActive(true)
      setError(error)
    }
  }

  const getUsers = async () => {
    try {
  
      const data = await apiFetch(`/user/friends/${chat.id}`);
      setUsers(data.users);
      setActive(true)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleData = (data, searched) => {
    return data.filter(c => c.name.includes(searched))
  }
  return (
    <>
      <button onClick={getUsers}>Add user</button>
      {active && 
      <div>
        <button onClick={() => setActive(false)}>Close</button>
        <SearchData
          data={users}
          setData={setFiltered}
          handleData={handleData}
        />
        <form onSubmit={handleAdd}>
            <div>
              {filtered.length > 0 && typeof filtered !== 'string' && (
                filtered.map(u => (
                    <div type="checkbox" key={u.id + "gs"}>
                      <input type="checkbox" value={u.id} onChange={handleSelect}/>
                      {u.avatarUrl === null
                      ? <div className="default-avatar">{u.name[0]}</div>
                      : <img src={u.avatarUrl} alt={u.name} />
                      }
                      <p>{u.name}</p>
                    </div>
                  )
                )
              )
              }
              {filtered === 'loading' && <p>Loading...</p>}
              {filtered === 'none' && <p>No user to add. Create a chat with users to add to this chat.</p>}
            </div>
          <button type="submit">Add</button>
        </form>
      </div>
      }
    </>
  )
}
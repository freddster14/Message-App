import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import Search from "./Search";
import SearchChats from "./SearchChats";

export default function AddUser({ chat }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
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
    if(selectedUsers.length < 0) {
      setError("No users selected")
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ chatId: chat.id, usersId: selectedUsers })
      }
      await apiFetch('/chat/add', options)
      setActive(false)
    } catch (error) {
      setError(error)
    }
  }

  const getUsers = async () => {
    try {
  
      const data = await apiFetch(`/user/friends/${chat.id}`);
      console.log(data)
      setUsers(data.users);
      setActive(true)
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <>
      <button onClick={getUsers}>Add user</button>
      {active && 
      <div>
        <button onClick={() => setActive(false)}>Close</button>
        <SearchChats
          chats={users}
          setData={setFiltered}
        />
        <p>{error}</p>
        <form onSubmit={handleAdd}>
            <div>
              {filtered.length > 0 && (
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
              )}
            </div>
          <button type="submit">Add</button>
        </form>
      </div>
      }
    </>
  )
}
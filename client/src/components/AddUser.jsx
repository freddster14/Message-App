import { useEffect, useState } from "react";
import apiFetch from "../api/client";

export default function AddUser({ chats, handleSubmit, setSelectedUsers }) {
  const [searched, setSearched] = useState("");
  const [error, setError] = useState("");

   useEffect(() => {
      if(searched === "") return;
      const find = setTimeout(async () => {
        try {
          const data = await apiFetch(`/chat/${searched}`)
          setUsers(data.users);
        } catch (error) {
          setError(error.message);
        }
      }, 3000)
      return () => clearTimeout(find)
    }, [searched])
  

  const handleSelect = (e) => {
    setSelectedUsers(prev => 
    prev.includes(e.target.value)
      ? prev.filter(id => id !== e.target.value)  // Remove
      : [...prev, e.target.value]                  // Add
  );
  }

  return (
    <>
      <div>
        <label htmlFor="search">Search</label>
        <input type="text" value={searched} onChange={(e) => setSearched(e.target.value)} />
      </div>
      <p>{error}</p>
      <form onSubmit={handleSubmit}>
          <div>
            {chats.length > 0 && (
              chats.map(u => {
                if(!u.isGroup) 
                return (
                  <div type="checkbox" key={u.id + "gs"}>
                    <input type="checkbox" value={u.members[0].id} onChange={handleSelect}/>
                    {u.members[0].avatarUrl === null
                    ? <div className="default-avatar">{u.members[0].name[0]}</div>
                    : <img src={u.members[0].avatarUrl} alt={u.members[0].name} />
                    }
                    <p>{u.members[0].name}</p>
                  </div>
                )
              })
            )}
          </div>
        <button type="submit">Create</button>
      </form>
    </>
  )
}
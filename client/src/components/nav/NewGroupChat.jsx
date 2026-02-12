import { useEffect, useState } from "react"
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";
import SearchData from "../SearchChats";
import Error from "../../pages/Error";

export default function NewGroupChat() {
  const { setRefreshTrigger } = useChats();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await apiFetch('/chat');
        setData(res.chats);
      } catch (error) {
        setError(error)
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
      setActive(false)
      setRefreshTrigger(prev => prev + 1);
      setSelectedUsers([])
    } catch (error) {
      setError(error)
    }
  }

   const handleSelect = (e) => {
    setSelectedUsers(prev => 
    prev.includes(e.target.value)
      ? prev.filter(id => id !== e.target.value)  // Remove
      : [...prev, e.target.value]                  // Add
  );
  }

  const handleData = (data, searched) => {
    return data.filter(c => c.isGroup ? c.name.includes(searched) : c.members[0].name.includes(searched))
  }


  if(!data) return null;
  return (

    <>
      {active && !error
        ? <div>
          <button onClick={() => setActive(false)}>Close</button>
          <SearchData
          data={data}
          setData={setFiltered}
          handleData={handleData}
          />
          <form onSubmit={handleSubmit}>
            <div>
              {filtered.length > 0 ? (
              filtered.map(u => {
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
              ) : <p>No users. Invite people to create group chats with them.</p>
              }
            </div>
            <button type="submit">Create</button>
          </form>
          </div>
        : <button onClick={() => setActive(true)}>Create group chat</button>
      }
      
    </>
     
    
  )
}
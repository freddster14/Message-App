import { useEffect, useState } from "react"
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";
import SearchData from "../SearchChats";
import styles from "../../styles/Nav.module.css"

export default function NewGroupChat() {
  const { setRefreshTrigger } = useChats();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState("loading")
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
        ? <div className={styles.modal}>
          <h2>Create group chat</h2>
          <p>Select users to add to the group chat</p>
          <SearchData
          data={data}
          setData={setFiltered}
          handleData={handleData}
          />
          <button className={styles.close} onClick={() => setActive(false)}>✖</button>
          <form onSubmit={handleSubmit}>
            <div>
              { filtered === 'loading' && <p>Loading...</p>}
              { filtered === 'none' && <p>No users found</p>}
              { filtered !== 'loading' && filtered !== 'none' && filtered.length > 0 &&
                filtered.map(u => {
                if(!u.isGroup) 
                return (
                  <div className={styles.userInput} key={u.id + "gs"}>
                    {u.members[0].avatarUrl === null
                    ? <div className={styles.defaultAvatar}>{u.members[0].name[0]}</div>
                    : <img src={u.members[0].avatarUrl} alt={u.members[0].name} />
                    }
                    <p>{u.members[0].name}</p>
                    <input type="checkbox" value={u.members[0].id} onChange={handleSelect}/>
                  </div>
                )
              })
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
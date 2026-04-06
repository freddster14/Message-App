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
      const selectedUsersIds = selectedUsers.map(c => c.members[0].id)
      const options = {
        method: "POST",
        body: JSON.stringify({ usersId: selectedUsersIds})
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
    const id = parseInt(e.target.value)
    
    if(e.target.checked) {
      const userToAdd = data.find(u => u.members[0].id === id)
      setSelectedUsers(prev => [...prev, userToAdd])
    } else {
      setSelectedUsers(prev => prev.filter(u => u.members[0].id !== id))
    }
  }

  const handleData = (data, searched) => {
    return data.filter(c => !c.isGroup  && c.members[0].name.includes(searched))
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
          <div className={styles.selected}>
            { selectedUsers.length > 0 && selectedUsers.map(c => (
               <div
               key={"c" + c.id}
               className={styles.selectedUser}
               onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== c.id))
               }>
               {c.members[0].avatarUrl === null
               ? <div className={styles.defaultAvatar}>{c.members[0].name[0]}</div>
               : <img src={c.members[0].avatarUrl} alt={c.members[0].name} />
               }
               <p>{c.members[0].name}</p>
             </div>
            ))}
          </div>
          
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
                    <input type="checkbox" value={u.members[0].id} onChange={handleSelect} checked={selectedUsers.some(s => s.members[0].id === u.members[0].id)}/>
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
import { useEffect, useState } from "react"
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";
import SearchData from "../SearchChats";
import Modal from "../Modal";
import { colorFor, initialsFor } from "../../utils/avatar";
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
    e?.preventDefault();
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

   const handleSelect = (id) => {
    const isSelected = selectedUsers.some(u => u.members[0].id === id);
    if(!isSelected) {
      const userToAdd = data.find(u => u.members[0].id === id)
      setSelectedUsers(prev => [...prev, userToAdd])
    } else {
      setSelectedUsers(prev => prev.filter(u => u.members[0].id !== id))
    }
  }

  const handleData = (data, searched) => {
    return data.filter(c => !c.isGroup  && c.members[0].name.includes(searched))
  }

  const errorMessage = error && (typeof error === 'string' ? error : error.message);

  if(!data) return null;
  return (
    <>
      <button className={styles.textButton} onClick={() => { setError(); setActive(true); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        New group
      </button>
      {active &&
        <Modal
          title="Create group chat"
          subtitle="Pick at least two people to add."
          onClose={() => setActive(false)}
          footer={<button onClick={handleSubmit}>Create group chat</button>}
        >
          {selectedUsers.length > 0 &&
            <div className={styles.selected}>
              {selectedUsers.map(c => (
                <div
                  key={"c" + c.id}
                  className={styles.selectedUser}
                  onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== c.id))}
                >
                  {c.members[0].avatarUrl === null
                    ? <div className={styles.defaultAvatar} style={{ background: colorFor(c.members[0].name) }}>{initialsFor(c.members[0].name)}</div>
                    : <div className={styles.defaultAvatar}><img src={c.members[0].avatarUrl} alt={c.members[0].name} /></div>
                  }
                  <p>{c.members[0].name}</p>
                </div>
              ))}
            </div>
          }
          <SearchData
            data={data}
            setData={setFiltered}
            handleData={handleData}
            placeholder="Search your contacts…"
          />
          {errorMessage && <p className={styles.bio} style={{ color: 'var(--danger)', marginTop: 8 }}>{errorMessage}</p>}
          <div style={{ marginTop: 8 }}>
            { filtered === 'loading' && <p className={styles.hint}>Loading...</p>}
            { filtered === 'none' && <p className={styles.hint}>No users found</p>}
            { filtered !== 'loading' && filtered !== 'none' && filtered.length > 0 &&
              filtered.map(u => {
              if(!u.isGroup)
              return (
                <div className={styles.checkRow} key={u.id + "gs"} onClick={() => handleSelect(u.members[0].id)}>
                  {u.members[0].avatarUrl === null
                    ? <div className={styles.defaultAvatar} style={{ background: colorFor(u.members[0].name) }}>{initialsFor(u.members[0].name)}</div>
                    : <div className={styles.defaultAvatar}><img src={u.members[0].avatarUrl} alt={u.members[0].name} /></div>
                  }
                  <div className={styles.userInfo} style={{ flex: 1 }}><p>{u.members[0].name}</p></div>
                  {(() => {
                    const isSelected = selectedUsers.some(s => s.members[0].id === u.members[0].id);
                    return <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>{isSelected ? '✓' : ''}</div>;
                  })()}
                </div>
              )
            })
            }
          </div>
        </Modal>
      }
    </>
  )
}

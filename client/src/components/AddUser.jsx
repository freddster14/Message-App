import { useState } from "react";
import apiFetch from "../api/client";
import { useChats } from "../context/ChatProvider";
import SearchData from "./SearchChats";
import Modal from "./Modal";
import { colorFor, initialsFor } from "../utils/avatar";
import styles from "../styles/Nav.module.css"

export default function AddUser({ chat, setChat, setError }) {
  const { setRefreshTrigger } = useChats()
  const [active, setActive] = useState(false);
  const [filtered, setFiltered] = useState([])
  const [users, setUsers] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])

  const handleSelect = (id) => {
    setSelectedUsers(prev =>
    prev.includes(id)
      ? prev.filter(u => u !== id)  // Remove
      : [...prev, id]                  // Add
  );
  }

   const handleAdd =  async (e) => {
    e?.preventDefault();
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
      setSelectedUsers([]);
      setFiltered([])
    } catch (error) {
      setActive(true)
      setError(error.message)
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
      <button className={styles.textButton} onClick={getUsers}>+ Add member</button>
      {active &&
        <Modal
          title="Add member"
          subtitle={`Add people you know to ${chat.name || 'this chat'}.`}
          onClose={() => setActive(false)}
          footer={<button onClick={handleAdd}>Add to chat</button>}
        >
          <SearchData
            data={users}
            setData={setFiltered}
            handleData={handleData}
            placeholder="Search your contacts…"
          />
          <div style={{ marginTop: 8 }}>
            {typeof filtered !== 'string' && (
              filtered.map(u => {
                const isSelected = selectedUsers.includes(u.id);
                return (
                  <div className={styles.checkRow} key={u.id + "gs"} onClick={() => handleSelect(u.id)}>
                    {u.avatarUrl === null
                      ? <div className={styles.defaultAvatar} style={{ background: colorFor(u.name) }}>{initialsFor(u.name)}</div>
                      : <div className={styles.defaultAvatar}><img src={u.avatarUrl} alt={u.name} /></div>
                    }
                    <div className={styles.userInfo} style={{ flex: 1 }}><p>{u.name}</p></div>
                    <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>{isSelected ? '✓' : ''}</div>
                  </div>
                )
              })
            )}
            {filtered === 'loading' && <p className={styles.hint}>Loading...</p>}
            {filtered === 'none' && <p className={styles.hint}>No user to add. Create a chat with users to add to this chat.</p>}
          </div>
        </Modal>
      }
    </>
  )
}

import { useState } from "react";
import NewChat from "../NewChat";
import Search from "../Search";
import Error from "../../pages/Error";
import Modal from "../Modal";
import styles from "../../styles/Nav.module.css"

export default function SearchedNewChats() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const [active, setActive] = useState(false);

  const close = () => {
    setActive(false);
    setUsers([])
  }

  return (
    <>
      {error && <Error setError={setError} error={error} style={'modal'}/>}
      <button className={styles.textButton} onClick={() => setActive(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Invite someone
      </button>
      {active &&
        <Modal title="Invite someone" subtitle="Search for people to start a new chat." onClose={close}>
          <div style={{ padding: "0 0 8px" }}>
            <Search url={'/user/search-new/'} setData={setUsers}/>
          </div>
          {users.length > 0 && typeof users !== 'string' &&
            <div className={styles.newChatUsers}>
              {users.map(u => (
                <NewChat key={"u" + u.id} u={u} setError={setError} />
              ))}
            </div>
          }
          {users === 'none' && <div className={styles.hint}>No user found</div>}
          {users === 'loading' && <div className={styles.hint}>Loading...</div> }
        </Modal>
      }
    </>
  )
}

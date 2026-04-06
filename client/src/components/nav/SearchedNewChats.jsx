import { useState } from "react";
import NewChat from "../NewChat";
import Search from "../Search";
import Error from "../../pages/Error";
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
      {active 
      ? 
        <div className={styles.modal}>
          <h2>Invite users to chat</h2>
          <p>Search for users below to start a new chat.</p>
          <button className={styles.close} onClick={close}>✖</button>
          <Search url={'/user/search-new/'} setData={setUsers}/>
          {users.length > 0 && typeof users !== 'string' &&

            <div className={styles.newChatUsers}>
              {users.map(u => (
                <div key={"u" + u.id}>
                  <NewChat u={u} setError={setError} />
                </div>
              ))}
            </div>
          }
          {users === 'none' && <div>No user found</div>}
          {users === 'loading' && <div>Loading...</div> }
        </div>
      : <button onClick={() => setActive(true)}>Invite someone</button>
      }
      
    </>
    
  )
}
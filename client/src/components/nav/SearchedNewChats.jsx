import { useState } from "react";
import NewChat from "../NewChat";
import Search from "../Search";

export default function SearchedNewChats() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  const close = () => {
    setActive(false);
    setUsers([])
  }
  return (
    <>
      {active 
      ? 
        <div>
          <button onClick={close}>Close</button>
          <Search url={'/user/search-new/'} setData={setUsers}/>
          {users.length > 0 && typeof users !== 'string' &&

            <div>
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
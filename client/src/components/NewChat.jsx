import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { useNavigate } from "react-router";

export default function NewChat() {
  const [searched, setSearched] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(searched === "") return;
    const find = setTimeout(async () => {
      try {
        const data = await apiFetch(`/user/${searched}`)
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      }
    }, 3000)
    return () => clearTimeout(find)
  }, [searched])

  const handleInvite = async (recipientId) => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ recipientId })
      }
      await apiFetch('/invite', options);
    } catch (error) {
      setError(error);
    }
  }
  return(
    <>
      <div>
        <p>search</p>
        <input type="text" value={searched} onChange={(e) => setSearched(e.target.value)} />
      </div>
      {users.length > 0 && error === "" 
      ? <div>
        {users.map(u => (
          <div key={"u" + u.id}>
            {u.avatarUrl !== "" ? <img></img> : <div>{u.name[0]} img</div>}
            <div>
              <p>{u.name}</p>
              <p>{u.bio}</p>
            </div>
            <button onClick={() => handleInvite(u.id)}>Send Invite</button>
          </div>
        ))}
      </div> 
      : <div>{error}</div>
    }
    </>
  )
}
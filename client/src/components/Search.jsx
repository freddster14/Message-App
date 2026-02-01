import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { useNavigate } from "react-router";
import NewChat from "./NewChat";

export default function SearchNewChat() {
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
            <NewChat u={u} setError={setError} />
          </div>
        ))}
      </div> 
      : <div>{error}</div>
    }
    </>
  )
}
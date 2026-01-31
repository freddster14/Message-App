import { useState } from "react"
import apiFetch from "../api/client";
import Invite from "./Invite";

export default function Inbox() {
  const [invites, setInvites] = useState([]);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
 

  const getInvites = async () => {
    try {
      const data = await apiFetch('/invite/received');
      setInvites(data);
      setActive(true);
    } catch (error) {
      setError(error.message)
    }
  }

  return(
    <div>
      <button onClick={getInvites}>Inbox</button>
      {active && 
        <div>
          { error === "" && invites.map(i => (
            <div key={"i" + i.id}>
              <Invite i={i} />
            </div>
          ))
          }
          { error !== "" && <div>{error}</div> }
        </div>
      }
    </div>
    
  )
}
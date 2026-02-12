import { useState } from "react"
import apiFetch from "../../api/client";
import Invite from "./Invite";
import Error from "../../pages/Error";

export default function Inbox() {
  const [invites, setInvites] = useState(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState();
 

  const getInvites = async () => {
    setError()
    if(active) {
      setActive(false);
      return;
    }
    try {
      const data = await apiFetch('/invite/received');
      setInvites(data.invites);
      setActive(true);
    } catch (error) {
      setError(error)
    }
  }
  console.log(error)
  return(
    <>
      {error && <Error error={error} setError={setError} style={'modal'}/>}
      <button onClick={getInvites}>Inbox</button>
      {active && 
        <div>
          <button onClick={() => setActive(false)}>✖</button>
          {invites.length > 0
            ? invites.map(i => (
              <div key={"i" + i.id}>
                <Invite i={i} setError={setError} />
              </div>
            )) 
          : <div>No invites</div>
          }
        </div>
      }
    </>
    
  )
}
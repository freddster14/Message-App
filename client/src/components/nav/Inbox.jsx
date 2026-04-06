import { useState } from "react"
import apiFetch from "../../api/client";
import Invite from "./Invite";
import Error from "../../pages/Error";
import styles from "../../styles/Nav.module.css";

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

  return(
    <>
      {error && <Error error={error} setError={setError} style={'modal'}/>}
      {active ?
        <div className={styles.modal}>
          <h2>Inbox</h2>
          <p style={{marginBottom: "1rem"}}>View your recent invites and more.</p>
          <button className={styles.close} onClick={() => setActive(false)}>✖</button>
          {invites.length > 0
            ? invites.map(i => (
              <div key={"i" + i.id}>
                <Invite i={i} setError={setError} />
              </div>
            )) 
          : <div>No invites</div>
          }
        </div>
        :  <button onClick={getInvites}>Inbox</button>
      }
    </>
    
  )
}
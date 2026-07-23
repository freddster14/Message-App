import { useEffect, useState } from "react"
import apiFetch from "../../api/client";
import Invite from "./Invite";
import Error from "../../pages/Error";
import Modal from "../Modal";
import styles from "../../styles/Nav.module.css";

export default function Inbox() {
  const [invites, setInvites] = useState(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState();

  const fetchInvites = async () => {
    try {
      const data = await apiFetch('/invite/received');
      setInvites(data.invites);
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    async function loadInitialInvites() {
      try {
        const data = await apiFetch('/invite/received');
        setInvites(data.invites);
      } catch (error) {
        setError(error)
      }
    }
    loadInitialInvites();
  }, []);

  const toggle = () => {
    setError()
    if (active) {
      setActive(false);
      return;
    }
    fetchInvites();
    setActive(true);
  }

  const removeInvite = (id) => {
    setInvites(prev => prev.filter(i => i.id !== id));
  }

  return (
    <>
      {error && <Error error={error} setError={setError} style={'modal'} />}
      <button className={styles.iconButton} onClick={toggle} aria-label="Inbox">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        {invites?.length > 0 && <div className={styles.badge}></div>}
      </button>
      {active &&
        <Modal title="Inbox" subtitle="View your recent invites and more." onClose={() => setActive(false)}>
          {invites?.length > 0
            ? invites.map(i => (
              <Invite key={"i" + i.id} i={i} setError={setError} onResolved={removeInvite} />
            ))
            : <div className={styles.hint}>No invites</div>
          }
        </Modal>
      }
    </>
  )
}

import { useState } from "react";
import apiFetch from "../api/client";
import { colorFor, initialsFor } from "../utils/avatar";
import styles from "../styles/Nav.module.css"

export default function NewChat({ u, setError }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState("Invite");

  const handleInvite = async (e, recipientId) => {
    e.preventDefault();
    if(isSubmit) return;
    setError()
    setIsSubmit(true);
    setValue("Invited");
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ recipientId })
      }
      await apiFetch('/invite', options);
    } catch (error) {
      setValue("Send Invite")
      setError(error);
      setIsSubmit(false)
    }
  }
  return (
    <div className={styles.row}>
      <div className={styles.userInfo}>
        {u.avatarUrl === null
          ? <div className={styles.defaultAvatar} style={{ background: colorFor(u.name) }}>{initialsFor(u.name)}</div>
          : <div className={styles.defaultAvatar}><img src={u.avatarUrl} alt={u.name} /></div>
        }
        <div>
          <p>{u.name}</p>
          {u.bio && <div className={styles.bio}>{u.bio}</div>}
        </div>
      </div>
      <button
        className={styles.inviteButton}
        style={isSubmit ? { background: 'var(--surface-2)', color: 'var(--text-dim)' } : { background: 'var(--accent)', color: '#fff' }}
        onClick={(e) => handleInvite(e, u.id)}
      >
        {value}
      </button>
    </div>
  )
}

import { useState } from "react";
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";
import { colorFor, initialsFor } from "../../utils/avatar";
import styles from "../../styles/Nav.module.css"

export default function Invite({ i, setError, onResolved }) {
  const { setRefreshTrigger } = useChats();
  const [isSubmit, setIsSubmit] = useState(false)
  const [isActive, setIsActive] = useState(true);

  const handleAccept = async () => {
    if(isSubmit) return;
    setError()
    setIsSubmit(true);
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ senderId: i.id })
      }
      await apiFetch('/invite/accept', options);
      setIsActive(false);
      onResolved?.(i.id);
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmit(false)
    }
  }

  const handleDecline = async () => {
    if(isSubmit) return;
    setError()
    setIsSubmit(true);
    try {
      const options = {
        method: 'DELETE',
        body: JSON.stringify({ senderId: i.id })
      }
      await apiFetch('/invite/decline', options);
      setIsActive(false);
      onResolved?.(i.id);
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <>
      {isActive &&
        <div className={styles.row}>
          <div className={styles.userInfo}>
            {i.avatarUrl === null
              ? <div className={styles.defaultAvatar} style={{ background: colorFor(i.name) }}>{initialsFor(i.name)}</div>
              : <div className={styles.defaultAvatar}><img src={i.avatarUrl} alt={i.name} /></div>
            }
            <p>{i.name}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.accept} onClick={handleAccept}>✓</button>
            <button className={styles.decline} onClick={handleDecline}>✕</button>
          </div>
        </div>
      }
    </>

  )
}

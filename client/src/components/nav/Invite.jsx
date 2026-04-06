import { useState } from "react";
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";
import styles from "../../styles/Nav.module.css"

export default function Invite({ i, setError }) {
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
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmit(false)
    }
  }
  
  return (
    <>
      {isActive && 
        <div className={styles.user}>
          <div className={styles.userInfo}>
            {i.avatarUrl === null
              ? <div className={styles.defaultAvatar}>{i.name[0]}</div>
              : <img src={i.avatarUrl} alt={i.name} />
            }
            <p>{i.name}</p>
          </div>
          <div>
            <button className={styles.actions} onClick={handleAccept}>✓</button>
            <button className={styles.actions} onClick={handleDecline}>✖</button>
          </div>
        </div>
      }
    </>
    
  )
}
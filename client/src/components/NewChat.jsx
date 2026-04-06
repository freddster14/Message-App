import { useState } from "react";
import apiFetch from "../api/client";
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
    <div className={styles.user}>
      <div className={styles.userInfo}>
        {u.avatarUrl === null
          ? <div className={styles.defaultAvatar}>{u.name[0]}</div>
          : <img src={u.avatarUrl} alt={u.name} />
        }
        <p>{u.name}</p>
      </div>
      <p>{u.bio}</p>
      <button onClick={(e) => handleInvite(e, u.id)}>{value}</button>
    </div>
  )
}
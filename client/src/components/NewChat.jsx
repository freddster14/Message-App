import { useState } from "react";
import apiFetch from "../api/client";

export default function NewChat({ u, setError }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState("Send Invite");

  const handleInvite = async (e, recipientId) => {
    e.preventDefault();
    if(isSubmit) return;
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
    }
  }
  return (
    <>
      {u.avatarUrl !== "" ? <img src={u.avatarUrl}></img> : <div>{u.name[0]} img</div>}
        <div>
          <p>{u.name}</p>
          <p>{u.bio}</p>
        </div>
        <button onClick={(e) => handleInvite(e, u.id)}>{value}</button>
    </>
  )
}
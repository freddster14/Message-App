import { useState } from "react";
import apiFetch from "../api/client";
import { useChats } from "../context/ChatProvider";

export default function Invite({ i }) {
  const { setRefreshTrigger } = useChats();
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAccept = async () => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ senderId: i.id })
      }
      await apiFetch('/invite/accept', options);
      setIsActive(false);
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDecline = async () => {
    try {
      const options = {
        method: 'DELETE',
        body: JSON.stringify({ senderId: i.id })
      }
      await apiFetch('/invite/decline', options);
      setIsActive(false);
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
    {isActive && <div className="invite">

    {i.avatarUrl !== "" ? <img src={i.avatarUrl}></img> : <div>{i.name[0]} img</div>}
    <div>
      <p>{i.name}</p>
      <p>{error}</p>
    </div>
    <button onClick={handleAccept}>Accept</button>
    <button onClick={handleDecline}>X</button>
    </div>}
    </>
    
  )
}
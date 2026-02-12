import { useState } from "react";
import apiFetch from "../../api/client";
import { useChats } from "../../context/ChatProvider";

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
        <div className="invite">
          {i.avatarUrl ? <img src={i.avatarUrl}></img> : <div>{i.name[0]}</div>}
          <div>
            <p>{i.name}</p>
          </div>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleDecline}>X</button>
        </div>
      }
    </>
    
  )
}
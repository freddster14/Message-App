import { useState } from "react";
import apiFetch from "../api/client";
import { useNavigate } from "react-router";

export default function Invite({ i }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccept = async () => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ senderId: i.id })
      }
      await apiFetch('/invite/accept', options);
      navigate('/dashboard');
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
      navigate('/dashboard');
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
    {i.avatarUrl !== "" ? <img></img> : <div>{i.name[0]} img</div>}
    <div>
      <p>{i.name}</p>
      <p>{error}</p>
    </div>
    <button onClick={handleAccept}>Accept</button>
    <button onClick={handleDecline}>X</button>
    </>
    
  )
}
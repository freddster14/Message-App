import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Inbox from "./Inbox";
import NewChat from "./NewChat";
import apiFetch from "../api/client";

export default function Nav() {
  const { user } = useAuth()

  const handleLogout = async () => {
    // try {
    //   await apiFetch('/logout', { method: 'POST' })
    // } catch (error) {

    // }
  }

  return (
    <nav>
      <h1>Message App</h1>
    {user 
    ? <div>
      <h1>{user.name}</h1>
      <NewChat />
      <Inbox />
      <button onClick={handleLogout}></button>
    </div>
    : <div>
       <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Sign In</Link>
    </div>
    }
     
    </nav>
  )
}
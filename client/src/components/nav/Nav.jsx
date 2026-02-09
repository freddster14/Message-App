import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Inbox from "./Inbox";
import apiFetch from "../../api/client";
import NewGroupChat from "./NewGroupChat";
import SearchedNewChats from "./SearchedNewChats";

export default function Nav() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' });
      setUser(null);
      navigate('/sign-in')
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav>
      <h1>Message App</h1>
    {user 
    ? <div>
      <h1>{user.name}</h1>
      <SearchedNewChats />
      <NewGroupChat />
      <Inbox />
      <button onClick={handleLogout}>Logout</button>
    </div>
    : <div>
       <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Sign In</Link>
    </div>
    }
     
    </nav>
  )
}
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
export default function Nav() {
  const { user } = useAuth()
  console.log(user)
  return (
    <nav>
      <h1>Message App</h1>
    {user ? <h1>{user.name}</h1>
    : <div>
       <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Sign In</Link>
    </div>
    }
     
    </nav>
  )
}
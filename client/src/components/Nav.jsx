import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Inbox from "./Inbox";
import { useEffect, useState } from "react";
import NewChat from "./NewChat";
export default function Nav() {
  const { user } = useAuth()

  return (
    <nav>
      <h1>Message App</h1>
    {user 
    ? <div>
      <h1>{user.name}</h1>
      <NewChat />
      <Inbox />
    </div>
    : <div>
       <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Sign In</Link>
    </div>
    }
     
    </nav>
  )
}
import { useState } from "react"
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import Edit from "../components/Edit";
import { setSocketAuthToken } from "../socket";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState(false)
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [edit, setEdit] = useState(false);
  const { user, setUser } = useAuth();

  if(user) return <Navigate to="/dashboard" replace />;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErr( "All fields are required")
      return;
    }
    if(password.length < 5) {
      setErr("Password too short");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ email, password, confirm })
      }
      const data = await apiFetch('/sign-up', options)
      setUser(data.user);
      setSocketAuthToken(data.token)
      setEdit(true)
    } catch (error) {
      setErr(error.message);
    }
  }

  return(
    <>
      {edit ? <Edit />
      :

      <div>
        <div>
          <h1>Sign Up</h1>
          <p>Already have an account? <Link to="/sign-in">Sign in</Link></p>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="pass">Password</label>
          {view ? <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
          : <input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
          }
          <button type="button" onClick={() => setView((e) => !e)}>View</button>
          <label htmlFor="confirm">Confirm</label>
          <input type="password" id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <p>{err}</p>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      }
    </>
  )
}
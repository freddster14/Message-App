import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [edit, setEdit] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErr({ msg: "All fields are required"})
      return;
    }
    if(password.length < 5) {
      setErr({ msg: "Password too short" });
      return;
    }
    if (password !== confirm) {
      setErr({ msg: "Passwords do not match" });
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ email, password, confirm })
      }
      const user = await apiFetch('/sign-up', options)
      setUser(user);
      setEdit(true)
    } catch (error) {
      setErr(error);
    }
  }

  return(
    <>
      {edit ? <Edit />
      :
       <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="confirm">Confirm</label>
        <input type="password" id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <p>{err.msg}</p>
        <button type="submit">Sign Up</button>
      </form>
      }
     
    </>
  )
}
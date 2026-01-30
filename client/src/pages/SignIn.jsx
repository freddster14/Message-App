import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [err, setErr] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isSubmit) return;
    setIsSubmit(true);
    if (!email || !password) {
      setErr("All fields are required");
      setIsSubmit(false)
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
      const user = await apiFetch('/sign-in', options);
      console.log(user)
      setUser(user);
      navigate('/chat')
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsSubmit(false)
    }
  }

  return(
    <div>
      <div>
        <h1>Sign In</h1>
        <p>Don't have an account? <Link to="/sign-up">Sign up</Link></p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p>{err}</p>
        <button type="submit" >Sign In</button>
      </form>
    </div>
  )
}
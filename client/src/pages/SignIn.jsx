import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import { setSocketAuthToken } from "../socket";
import styles from "../styles/Auth.module.css"

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [err, setErr] = useState("");
  const { setUser, user, loading } = useAuth();
  const navigate = useNavigate();

  if(loading) return <div className={styles.page}>Loading...</div>
  if(user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isSubmit) return;
    setErr("")
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
      const data = await apiFetch('/sign-in', options);
      setUser(data.user);
      setSocketAuthToken(data.token)
      navigate('/dashboard')
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsSubmit(false)
    }
  };


  return(
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sign In</h1>
        <p className={styles.subheading}>Don't have an account? <Link to="/sign-up">Sign up</Link></p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="pass">Password</label>
            <input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <p className={styles.error}>{err}</p>}
          <button type="submit" className={styles.submit}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

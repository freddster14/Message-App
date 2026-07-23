import { useState } from "react"
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import Edit from "../components/Edit";
import { setSocketAuthToken } from "../socket";
import styles from "../styles/Auth.module.css"

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState(false)
  const [confirm, setConfirm] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [err, setErr] = useState("");
  const [edit, setEdit] = useState(false);
  const { user, setUser, loading } = useAuth();


  if(loading) return <div className={styles.page}>Loading...</div>
  if(user) return <Navigate to="/dashboard" replace />;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("")
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
    if(isSubmit) return;
    setIsSubmit(true);
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ email, password, confirm })
      }
      const data = await apiFetch('/sign-up', options)
      setUser(data.user);
      setSocketAuthToken(data.token)
      setEdit(true)
      setIsSubmit(false)
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsSubmit(false)
    }
  }

  return(
    <>
      {edit ? <Edit />
      :
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Sign Up</h1>
          <p className={styles.subheading}>Already have an account? <Link to="/sign-in">Sign in</Link></p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label htmlFor="pass">Password</label>
              <div className={styles.passwordRow}>
                {view ? <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                : <input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
                }
                <button type="button" className={styles.viewButton} onClick={() => setView((e) => !e)}>View</button>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm">Confirm</label>
              <input type="password" id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {err && <p className={styles.error}>{err}</p>}
            <button type="submit" className={styles.submit}>Sign Up</button>
          </form>
        </div>
      </div>
      }
    </>
  )
}

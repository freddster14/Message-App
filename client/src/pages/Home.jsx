import { Link, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css'

export default function Home() {
  const { user } = useAuth();

  if(user) return <Navigate to="/dashboard" replace />;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h2 className={styles.heading}>Join our new message platform!</h2>
        <p className={styles.subheading}>Real-time chats, group conversations, and connections — all in one place.</p>
        <div className={styles.actions}>
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/sign-in" className={styles.secondary}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Inbox from "./Inbox";
import apiFetch from "../../api/client";
import NewGroupChat from "./NewGroupChat";
import SearchedNewChats from "./SearchedNewChats";
import { initialsFor } from "../../utils/avatar";
import styles from "../../styles/Nav.module.css"

export default function Nav() {
  const { user, setUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
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
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>◐</div>
        Loop
      </div>
      {user
        ? <div className={styles.user}>
            <SearchedNewChats />
            <NewGroupChat />
            <Inbox />
            <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
              {dark
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <div className={styles.divider}></div>
            <div className={styles.profile}>
              <div className={styles.avatar}>
                {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : initialsFor(user.name)}
              </div>
              <div className={styles.name}>{user.name}</div>
            </div>
            <button className={styles.textButton} onClick={handleLogout}>Logout</button>
          </div>
        : <div className={styles.buttons}>
            <Link to='/sign-up'>Sign Up</Link>
            <Link to='/sign-in'>Sign In</Link>
          </div>
      }
    </nav>
  )
}

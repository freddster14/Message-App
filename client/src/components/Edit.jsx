import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import { useNavigate } from "react-router";
import { setSocketAuthToken } from "../socket";
import styles from "../styles/Auth.module.css"

export default function Edit() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [img, setImg] = useState()
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name ) {
      setError("Name is required")
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ name, bio, avatarUrl: img })
      }
      const data = await apiFetch('/user/update', options );
      setUser(data.user);
      setSocketAuthToken(data.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleImg = (e) => {
    const file = e.target.files[0];
    if(!file) return setError("Uploaded failed")
    setImg(file)
    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
  }
  //prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarUrl !== "") {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.closeRow}>
          <button type="button" onClick={() => navigate('/dashboard')}>Close</button>
        </div>
        <div className={styles.editHeader}>
          <div className={styles.editAvatar}>
            {avatarUrl ? <img src={avatarUrl} alt={name} /> : name[0].toUpperCase()}
          </div>
          <div>
            <label htmlFor="upload" className={styles.viewButton} style={{ display: 'inline-block', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer' }}>Add image</label>
            <input type="file" accept="image/*" id="upload" value="" onChange={handleImg} style={{ display: 'none' }} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="bio">Bio</label>
            <input type="text" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit}>Save</button>
        </form>
      </div>
    </div>
  )
}

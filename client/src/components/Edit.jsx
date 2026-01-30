import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Edit({ props }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const previewImg = (e) => {
    const file = e.files[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  }
  return (
    <div>
      <div>
        {avatarUrl !== "" ? <img src={avatarUrl} />
          : <div>{name[0].toUppercase()}</div>
        }
        <input type="file" accept="image/*" onChange={(e) => previewImg(e)}/>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="bio">Bio</label>
        <input type="text" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
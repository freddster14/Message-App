import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client";
import { useNavigate } from "react-router";
import { setSocketAuthToken } from "../socket";

export default function Edit() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [img, setImg] = useState()
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log(user)
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
    <div>
      <div>
        <button onClick={() => navigate('/chat')}>Close</button>
        {avatarUrl !== "" ? <img src={avatarUrl} />
          : <div>{name[0].toUppercase()}</div>
        }
        <label htmlFor="upload">Add image</label>
        <input type="file" accept="image/*" id="upload" value="" onChange={handleImg}/>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="bio">Bio</label>
        <input type="text" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <p>{error}</p>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
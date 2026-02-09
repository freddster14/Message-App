import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import NewChat from "./NewChat";

export default function Search({ url, setData }) {
  const [searched, setSearched] = useState("");
  
  const [error, setError] = useState("");

  useEffect(() => {
    if(searched === "") return;
    setData('loading');
    const find = setTimeout(async () => {
      try {
        const data = await apiFetch(`${url}${searched}`);
        if(data.users.length === 0) {
          setData('none');
          return;
        }
        setData(data.users);
      } catch (error) {
        setError(error.message);
      }
    }, 2000)
    return () => clearTimeout(find)
  }, [searched, setData, url])


  return(
    <> 
      <div>
        <p>search</p>
        <input type="text" value={searched} onChange={(e) => setSearched(e.target.value)} />
        <p>{error}</p>
      </div>
    </>
  )
}
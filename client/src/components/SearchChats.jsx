import { useEffect, useState } from "react"
import Search from "./Search";

export default function SearchChats({ chats, setData }) {
  const [searched, setSearched] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
   
    const find = setTimeout(() => {
       if(searched === "") {
        return setData(chats);
      }
      setData(chats.filter(c => c.isGroup ? c.name.includes(searched) : c.members[0].name.includes(searched)))
    }, 1000)
    return () => clearTimeout(find);
  }, [setData, searched, chats])

 

  return (
    <input type="text" onChange={(e) => setSearched(e.target.value)} value={searched} />
      
  )
}
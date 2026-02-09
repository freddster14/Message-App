import { useEffect, useState } from "react"
import Search from "./Search";

export default function SearchData({ data, setData, handleData }) {
  const [searched, setSearched] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
   
    const find = setTimeout(() => {
      setData('loading')
       if(searched === "") {
        return setData(data);
      }
      const filtered = handleData(data, searched);
      if(filtered.length === 0) {
        setData('none')
      } else {
        setData(filtered);
      }
    }, 1000)
    return () => clearTimeout(find);
  }, [handleData, data, searched, setData])

 

  return (
    <input type="text" onChange={(e) => setSearched(e.target.value)} value={searched} />
      
  )
}
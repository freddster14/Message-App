import { useEffect, useState } from "react"
import Search from "./Search";

export default function SearchData({ data, setData, handleData }) {
  const [searched, setSearched] = useState("");

  useEffect(() => {
    console.log("ran2");
    setData('loading')

    const find = setTimeout(() => {
       if(searched === "" && data.length > 0) {
        return setData(data);
      } else if(data.length === 0) {
        setData('none');
        return;
      }
      const filtered = handleData(data, searched);
      if(filtered.length === 0) {
        setData('none')
      } else {
        setData(filtered);
      }
    }, 1000)
    return () => clearTimeout(find);
  }, [searched])

  return (
    <input type="text" onChange={(e) => setSearched(e.target.value)} value={searched} />
  )
}
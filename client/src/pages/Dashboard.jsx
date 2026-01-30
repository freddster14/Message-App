import { useLoaderData } from "react-router";
import Chat from "../components/Chat";

export default function Dashboard() {
  const data = useLoaderData();
  return (
    <>
      <Chat chats={data.chats}/>
      <h2>chat messaes</h2>
    </>
  )
}
import apiFetch from "../api/client";

export default function AllChats(props) {

  const openChat = async (chatId) => {
    try {
      const data = await apiFetch(`/chat/${chatId}`)
      props.setChat(data.chat);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      {props.chats.map(c => {
        if(!c.isGroup) {
          return (
            <div key={"c" + c.id} onClick={() => openChat(c.id)}>
              {c.members[0].avatarUrl === ""
              ? <div className="default-avatar">{c.members[0].name[0]}</div>
              : <img src={c.members[0].avatarUrl} alt={c.members[0].name} />
              }
              <p>{c.members[0].name}</p>
            </div>
          )
        }
        
      })}  

    </>
  )
}

export default function Chat(props) {
  return (
    <>
      {props.chats.map(c => {
        if(!c.isGroup) {
          return (
            <div key={c.id}>
              
            </div>
          )
        }
        
      })}  

    </>
  )
}
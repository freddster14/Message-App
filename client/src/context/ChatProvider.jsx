import { createContext, useContext, useState } from "react";


const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return(
    <ChatContext.Provider value={{ refreshTrigger, setRefreshTrigger}}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChats() {
  return useContext(ChatContext)
}
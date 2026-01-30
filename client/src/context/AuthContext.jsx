import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import apiFetch from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiFetch('/user');
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      { children }
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
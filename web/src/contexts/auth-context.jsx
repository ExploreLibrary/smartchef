import { useState, useContext, createContext, useEffect } from "react";
import * as api from "../services/api-service";
import { useNavigate } from "react-router-dom";

// Clave usada para guardar y leer el usuario en localStorage
export const LS_USER_KEY = "current-user";

// Creamos el contexto vacío — su valor real lo provee AuthContextProvider
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await api.getProfile();
        setUser(user);
      } catch (err) {
        // Don't force navigation if the user is already visiting a public route
        const pathname = typeof window !== "undefined" ? window.location.pathname : "";
        if (pathname !== "/login" && pathname !== "/register") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const login = (user) => {
    setUser(user);
  };

  // logout elimina el usuario del estado y de localStorage.
  // La cookie de sesión la elimina el servidor al llamar a DELETE /sessions.
  const logout = () => {
    setUser(undefined);
  };

  if (loading) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
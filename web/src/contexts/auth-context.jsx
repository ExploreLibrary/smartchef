import { useState, useContext, createContext, useEffect } from "react";
import * as api from "../services/api-service";
import { useNavigate } from "react-router-dom";

export const LS_USER_KEY = "current-user";

const normalizeFavorites = (favorites = []) => {
  if (!Array.isArray(favorites)) return [];

  return [...new Set(
    favorites
      .map((favorite) => {
        if (typeof favorite === "string" || typeof favorite === "number") {
          return String(favorite);
        }

        if (favorite && typeof favorite === "object") {
          return String(favorite.mealId ?? favorite.id ?? favorite._id ?? "");
        }

        return "";
      })
      .filter(Boolean)
  )];
};

const persistUser = (user) => {
  if (typeof window === "undefined") return;

  if (!user) {
    localStorage.removeItem(LS_USER_KEY);
    return;
  }

  const userToStore = {
    ...user,
    favorites: normalizeFavorites(user?.favorites ?? []),
  };

  localStorage.setItem(LS_USER_KEY, JSON.stringify(userToStore));
};

const readStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const rawUser = localStorage.getItem(LS_USER_KEY);
    if (!rawUser) return null;

    const parsedUser = JSON.parse(rawUser);
    return {
      ...parsedUser,
      favorites: normalizeFavorites(parsedUser?.favorites ?? []),
    };
  } catch {
    return null;
  }
};

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const syncFavorites = async () => {
    try {
      const favoriteRecipes = await api.listFavorites();
      const nextFavorites = normalizeFavorites(
        favoriteRecipes.map((favorite) => favorite.mealId)
      );

      setUser((currentUser) => {
        if (!currentUser) return currentUser;

        const nextUser = {
          ...currentUser,
          favorites: nextFavorites,
        };

        persistUser(nextUser);
        return nextUser;
      });

      return nextFavorites;
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileUser = await api.getProfile();
        const favoriteRecipes = await api.listFavorites().catch(() => []);

        const mergedUser = {
          ...profileUser,
          favorites: normalizeFavorites(
            favoriteRecipes.map((favorite) => favorite.mealId)
          ),
        };

        setUser(mergedUser);
        persistUser(mergedUser);
      } catch (err) {
        const pathname = typeof window !== "undefined" ? window.location.pathname : "";
        if (pathname !== "/login" && pathname !== "/register") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const login = (userData) => {
    const nextUser = {
      ...userData,
      favorites: normalizeFavorites(userData?.favorites ?? []),
    };

    setUser(nextUser);
    persistUser(nextUser);
  };

  const updateFavorites = (updatedUser) => {
    const nextUser = {
      ...updatedUser,
      favorites: normalizeFavorites(updatedUser?.favorites ?? []),
    };

    setUser((currentUser) => ({
      ...currentUser,
      ...nextUser,
      favorites: nextUser.favorites,
    }));
    persistUser(nextUser);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      persistUser(null);
      navigate("/login");
    }
  };

  if (loading) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateFavorites, syncFavorites }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
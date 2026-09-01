import { useAuth } from "../../contexts/auth-context";
import { useEffect, useState } from "react";

function FavoriteButton({ recipeId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, updateFavorites } = useAuth();

  useEffect(() => {
    if (Array.isArray(user?.favorites)) {
      setIsFavorite(user.favorites.includes(recipeId));
    }
  }, [user?.favorites, recipeId]);

  const handleToggleRecipeFavorite = function () {
    if (!user) return;

    const currentFavorites = Array.isArray(user.favorites) ? user.favorites : [];
    const alreadyFavorite = currentFavorites.includes(recipeId);
    const nextFavorites = alreadyFavorite
      ? currentFavorites.filter((favoriteRecipeId) => favoriteRecipeId !== recipeId)
      : [...currentFavorites, recipeId];

    const updatedUser = {
      ...user,
      favorites: nextFavorites,
    };

    setIsFavorite(!alreadyFavorite);
    updateFavorites(updatedUser);
  };

  return (
    <button className="favorite-button" onClick={handleToggleRecipeFavorite}>
      {(isFavorite ) && <>
      <span className="favorite-button__text">Remove from Favorites</span>
      </>}  
      {(!isFavorite ) && <>
      <span className="favorite-button__icon">❤️</span>
      <span className="favorite-button__text">Add to Favorites</span>
      </>}
    </button>
  );
}

export default FavoriteButton;
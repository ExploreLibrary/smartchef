import { useAuth } from "../../contexts/auth-context";
import { useEffect, useState } from "react";
import * as api from "../../services/api-service";

function FavoriteButton({ recipeId, recipeName, recipeThumb }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, syncFavorites } = useAuth();

  useEffect(() => {
    const favoriteIds = Array.isArray(user?.favorites)
      ? user.favorites.map((favorite) => String(favorite))
      : [];

    setIsFavorite(favoriteIds.includes(String(recipeId)));
  }, [user?.favorites, recipeId]);

  const handleToggleRecipeFavorite = async function () {
    if (!user) return;

    const normalizedRecipeId = String(recipeId);
    const currentFavorites = Array.isArray(user.favorites)
      ? user.favorites.map((favorite) => String(favorite))
      : [];
    const alreadyFavorite = currentFavorites.includes(normalizedRecipeId);

    try {
      if (alreadyFavorite) {
        const favoriteRecipes = await api.listFavorites();
        const favoriteToDelete = favoriteRecipes.find(
          (favorite) => String(favorite.mealId) === normalizedRecipeId
        );

        if (favoriteToDelete) {
          await api.deleteFavorite(favoriteToDelete.id || favoriteToDelete._id);
        }
      } else {
        await api.createFavorite({
          mealId: normalizedRecipeId,
          mealName: recipeName ?? "Recipe",
          mealThumb: recipeThumb ?? "",
        });
      }

      await syncFavorites();
      setIsFavorite(!alreadyFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <button className="favorite-button" onClick={handleToggleRecipeFavorite}>
      {isFavorite ? (
        <>
          <span className="favorite-button__text">Remove from Favorites</span>
        </>
      ) : (
        <>
          <span className="favorite-button__icon">❤️</span>
          <span className="favorite-button__text">Add to Favorites</span>
        </>
      )}
    </button>
  );
}

export default FavoriteButton;
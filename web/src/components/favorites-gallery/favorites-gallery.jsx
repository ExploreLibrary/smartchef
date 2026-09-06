import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../services/api-service";

function FavoritesGallery() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const favoriteRecipes = await api.listFavorites();
        setMeals(Array.isArray(favoriteRecipes) ? favoriteRecipes : []);
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  return (
    <div className="gallery__outer-container">
      {loading && <p>Loading meals...</p>}
      {!loading && isError && <p>Unable to load meals.</p>}
      {!loading && !isError && (
        <>
          {meals.length === 0 ? (
            <div className="gallery gallery--empty">
              <p className="gallery__empty-state">You have no saved recipes yet.</p>
            </div>
          ) : (
            <div className="gallery">
              {meals.map((meal) => (
                <article className="gallery__meal" key={meal._id ?? meal.id ?? meal.mealId}>
                  <Link className="gallery__meal-img-link" to={`/recipes/${meal.mealId}`}>
                    <div className="gallery__meal-img-container">
                      <img src={meal.mealThumb} alt={meal.mealName} />
                    </div>
                  </Link>
                  <h4>{meal.mealName}</h4>
                  <Link className="gallery__meal-link" to={`/recipes/${meal.mealId}`}>View recipe</Link>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FavoritesGallery;
import { useState, useEffect } from "react";
import { getMealsByCategory } from "../../services/api-service";
import { Link } from "react-router-dom";

function Gallery({ category }) {

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const mealsData = await getMealsByCategory(category);
        setMeals(mealsData);
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMeals();
  }, [category]);

  return (
    <div className="gallery__outer-container">
      {loading && (<p>Loading meals...</p>)}
      {!loading && isError && (<p>Unable to load meals.</p>)}
      {!loading && !isError && (

      <div className="gallery">
        {meals.slice(0, 5).map((meal) => (
          <article className="gallery__meal" key={meal.externalId}>
            <Link className="gallery__meal-img-link" to={`/recipes/${meal.externalId}`}>
              <img src={meal.mealThumb} alt={meal.mealName} />
            </Link>
            <h4>{meal.mealName}</h4>
            {meal.country && <p>{meal.country}</p>}
            <Link className="gallery__meal-link" to={`/recipes/${meal.externalId}`}>View recipe</Link>
          </article>
        ))}
      </div>
      
      )}
    </div>
  );
}

export default Gallery;
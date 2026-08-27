import { useState, useEffect } from "react";
import { getMealByCategory } from "../../services/api-service";


function Gallery() {

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
    <div className="gallery">
        My Gallery
    </div>
  );
}

export default Gallery;
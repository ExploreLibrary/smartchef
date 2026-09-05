import { useParams } from "react-router-dom";
import { PageLayout } from "../layouts";
import RecipeDetail from "../components/recipe-detail/recipe-detail";
import { useState, useEffect } from "react";
import { getRecipeDetail, checkPantry } from "../services/api-service";

function RecipeDetailPage() {
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [pantryCheck, setPantryCheck] = useState(null);
  const [pantryLoading, setPantryLoading] = useState(false);
  const [pantryError, setPantryError] = useState(false);

  const { mealId } = useParams();

  useEffect(() => {
    async function fetchRecipe() {
      if (!mealId) {
        setIsError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setIsError(false);

        const response = await getRecipeDetail(mealId);

        const recipeData = response?.meals?.[0] ?? {};

        if (!recipeData.idMeal) {
          setIsError(true);
          return;
        }

        setRecipe(recipeData);
      } catch (error) {
        console.error("Error loading recipe:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [mealId]);

  const handleCheckPantry = async () => {
    try {
      setPantryLoading(true);
      setPantryError(false);

      const response = await checkPantry(mealId);

      setPantryCheck(response);
    } catch (error) {
      console.error("Error checking pantry:", error);
      setPantryError(true);
      setPantryCheck(null);
    } finally {
      setPantryLoading(false);
    }
  };

  return (
    <PageLayout>
      {loading && <p>Cargando receta...</p>}

      {isError && (
        <p>No se pudo cargar la receta.</p>
      )}

      {!loading && !isError && (
        <RecipeDetail
          recipeData={recipe}
          onCheckPantry={handleCheckPantry}
          pantryCheck={pantryCheck}
          pantryLoading={pantryLoading}
          pantryError={pantryError}
        />
      )}
    </PageLayout>
  );
}

export default RecipeDetailPage;

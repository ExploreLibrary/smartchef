import { useParams } from "react-router";
import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import RecipeDetail from "../components/recipe-detail/recipe-detail";
import { useState, useEffect } from "react";
import { getRecipeDetail } from "../services/api-service";

function RecipeDetailPage() {
    const [recipe, setRecipe] = useState({});
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const { mealId } = useParams();

    useEffect(() => {
        async function fetchRecipe() {
          if (!mealId) {
            setIsError(true);
            setLoading(false);
            return;
          }
          try {
            const recipeData = await getRecipeDetail.getRecipe(mealId);
            setRecipe(recipeData);
          } catch {
            setIsError(true);
          } finally {
            setLoading(false);
          }
        }
        fetchRecipe();
      }, [mealId]);

  return (
    <PageLayout>
      <RecipeDetail recipe={recipe} />
    </PageLayout>
  );
}

export default RecipeDetailPage;

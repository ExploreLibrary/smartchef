import { useParams } from "react-router";
import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import RecipeDetail from "../components/recipe-detail/recipe-detail";

function RecipeDetailPage() {
  const { user } = useAuth();
  const { mealId } = useParams();

  return (
    <PageLayout>
      <RecipeDetail recipeId={mealId || 1} />
    </PageLayout>
  );
}

export default RecipeDetailPage;

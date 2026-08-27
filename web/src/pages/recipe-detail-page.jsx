import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import RecipeDetail from "../components/recipe-detail/recipe-detail";

function RecipeDetailPage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <RecipeDetail recipeId={1} />
    </PageLayout>
  );
}

export default RecipeDetailPage;

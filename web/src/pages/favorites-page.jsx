import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import FavoritesGallery from "../components/favorites-gallery/favorites-gallery";

function FavoritesPage() {
  const { user } = useAuth();
  return (
    <PageLayout>
    <div className="main-content main-content--home">
      <div>
        <h1 className="favorite-recipes-title"> My Favorite Recipes </h1>
        <FavoritesGallery />

      </div>

    </div>
    </PageLayout>
  );
}

export default FavoritesPage;

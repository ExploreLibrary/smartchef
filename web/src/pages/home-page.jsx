import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import Gallery from "../components/gallery/gallery";

function RecipeDetailPage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <h1 className="welcome">{(user) ? `Welcome to SmartChef, ${user.name}`: `Welcome to SmartChef` }</h1>
      
      <div>
        <h3 className="home-category-title"> Discover Delicious  vegan Recipes </h3>
        <Gallery category="Vegan" />
      </div>
      
      <div>
        <h3 className="home-category-title"> Discover Delicious  chicken Recipes </h3>
        <Gallery category="Chicken" />
      </div>
      
      <div>
        <h3 className="home-category-title"> Discover Delicious  seafood Recipes </h3>
        <Gallery category="Seafood" />
      </div>
      
      <div>
        <h3 className="home-category-title"> Discover Delicious  dessert Recipes </h3>
        <Gallery category="Dessert" />
      </div>

    </PageLayout>
  );
}

export default RecipeDetailPage;

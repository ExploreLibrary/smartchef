import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";
import Gallery from "../components/gallery/gallery";

function HomePage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <h1 className="welcome">Welcome to SmartChef</h1>

      <h2> Hello, {user?.name || "there"}! </h2>

      <h3> Discover Delicious  vegan Recipes </h3>
      <Gallery category="Vegan" />
      
      <h3> Discover Delicious  chicken Recipes </h3>
      <Gallery category="Chicken" />
      
      <h3> Discover Delicious  seafood Recipes </h3>
      <Gallery category="Seafood" />
      
      <h3> Discover Delicious  dessert Recipes </h3>
      <Gallery category="Dessert" />
      
      <h3> Favorite Recipes </h3>


    </PageLayout>
  );
}

export default HomePage;

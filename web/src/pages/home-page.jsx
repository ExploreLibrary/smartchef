import { PageLayout } from "../layouts";
import { useAuth } from "../contexts/auth-context";

function HomePage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <h1 className="welcome">Welcome to SmartChef</h1>

      <h2> Hello, {user?.name || "there"}! </h2>

      <h3> Discover Delicious Recipes </h3>

      <h4> Favorite Recipes </h4>


    </PageLayout>
  );
}

export default HomePage;

import { Routes, Route } from "react-router-dom";
import {
  LoginPage,
  HomePage,
  RegisterPage,
  RecipeDetailPage,
  FavoritesPage,
  RecipeSearchPage,
  PantryPage

} from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/" element={<HomePage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/recipes/:mealId" element={<RecipeDetailPage />}/>
        <Route path="/my-favorite-recipes" element={<FavoritesPage />}/>
        <Route path="/recipe-search" element={<RecipeSearchPage />} />
        <Route path="/my-pantry" element={<PantryPage />} />
      </Routes>
    </>
  );
}

export default App;
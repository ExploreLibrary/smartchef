import { Routes, Route } from "react-router";
import {
  LoginPage,
  HomePage,
  RegisterPage,
  RecipeDetailPage

} from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/recipes/:mealId" element={<RecipeDetailPage />}/>
      </Routes>
    </>
  );
}

export default App;
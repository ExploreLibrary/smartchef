import { Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<HomePage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/recipes/:mealId" element={<RecipeDetailPage />}/>
      </Routes>
    </>
  );
}

export default App;
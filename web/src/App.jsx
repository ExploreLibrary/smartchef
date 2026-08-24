import { Routes, Route } from "react-router";
import {
  LoginPage,
  HomePage,
  RegisterPage
} from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/register" element={<RegisterPage />}/>
      </Routes>
    </>
  );
}

export default App;
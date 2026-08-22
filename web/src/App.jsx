import { Routes, Route } from "react-router";
import {
  LoginPage,
  HomePage
} from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/home" element={<HomePage />}/>
      </Routes>
    </>
  );
}

export default App;
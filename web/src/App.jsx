import { Routes, Route } from "react-router";
import {
  LoginPage,
} from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />}
        />
      </Routes>
    </>
  );
}

export default App;
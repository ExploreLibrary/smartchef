import { Routes, Route } from "react-router";
import { PrivateRoute } from "./guards";
import { Navbar } from "./components/ui";
import {
  LoginPage,
} from "./pages";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />}
        />
      </Routes>
    </>
  );
}

export default App;
import Logo from "../../../assets/smartchef-logo.png";
import { useAuth } from "../../../contexts/auth-context";
import { Link } from "react-router-dom";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar__primary">
        <Link to="/"><img className="navbar__logo" src={Logo} alt="Logo" /></Link>
      </div>
      <div className="navbar__menu-container">
        <ul className="navbar__navigation">
          <li><Link className="navbar__link" to="/">Home</Link></li>
          <li><Link className="navbar__link" to="/recipe-search">Recipe Search</Link></li>
          <li><Link className="navbar__link" to="/my-pantry">My Pantry</Link></li>
          <li><Link className="navbar__link" to="/my-favorite-recipes">My Favorite Recipes</Link></li>
        </ul>
      </div>
      <div className="navbar__secondary">
        {user?(
            <button
                className="navbar__login-logout-btn"
                onClick={() => logout()}
              >
                Logout
              </button>
        ) : (
          <Link className="navbar__secondary-link" to="/login">Login</Link>
        )}
        <Link className="navbar__secondary-link navbar__secondary-link--register" to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Navbar;
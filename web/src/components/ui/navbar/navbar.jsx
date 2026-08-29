import Logo from "../../../assets/smartchef-logo.png";
import MenuHamburgerIcon from "../../../assets/menu-hamburger.svg";
import { Link } from "react-router-dom";

function Navbar() {

  return (
    <div className="navbar">
      <Link to="/"><img className="navbar__logo" src={Logo} alt="Logo" /></Link>
      <button className="navbar__menu-button"><img className="navbar__menu-icon" src={MenuHamburgerIcon} alt="Menu Hambuger Icon" /></button>
    </div>
  );
}

export default Navbar;
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        AFTERLIGHT<span>.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/#explore">Explore</Link> 
        <Link to="/projects">Projects</Link>
        <Link to="/about">About</Link>
      </div>

      {/* Arrow removed from here */}
      <button className="nav-button">
        Explore Archive
      </button>
    </nav>
  );
}

export default Navbar;
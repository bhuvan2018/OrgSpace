import "../styles/layout.css";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-title">OrgSpace</div>

        <div className="nav-buttons">
          <button className="btn-blue" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button className="btn-green" onClick={() => navigate("/members")}>
            Members
          </button>

          <button className="btn-red" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="page-container">{children}</div>
    </div>
  );
}
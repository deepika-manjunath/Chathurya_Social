import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ closeSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // optional: remove JWT if stored
    navigate("/"); // redirect to home/login page
  };

  return (
    <div
      className="fixed top-0 right-0 h-full w-64 bg-base-100 shadow-xl p-6 z-50"
      onMouseLeave={closeSidebar} // close when cursor leaves
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      <ul className="menu gap-2">
        <li>
          <Link to="/dashboard">Home</Link>
        </li>

        {user && (
          <li>
            <Link to={`/profile/${user.username}`}>Profile</Link>
          </li>
        )}

        <li>
          <Link to="/events">Attendance</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        {/* Logout button */}
        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error w-full text-left"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalAttendance: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token"); // JWT token
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // redirect to login
  };

  // Fetch dashboard stats
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/member-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/recent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setActivities(res.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchStats();
    fetchRecentActivities();
  }, [token]);

  // Fetch users dynamically as search changes
  useEffect(() => {
    if (!token || !search) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/search?q=${search}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    fetchUsers();
  }, [search, token]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      {user && (
        <Navbar
          openSidebar={() => setSidebarOpen(true)}
          logout={handleLogout}
        />
      )}

      {/* Sidebar */}
      {user && sidebarOpen && (
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto p-8 pt-24">
        {/* Search Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Search Members</h2>
          <input
            type="text"
            placeholder="Search members..."
            className="input input-bordered w-full max-w-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Search Results */}
        {search && (
          <div className="card bg-base-100 shadow mb-8">
            <div className="card-body">
              <h2 className="card-title mb-2">Members</h2>
              {users.length === 0 && (
                <p className="text-gray-500">No members found</p>
              )}
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.username}
                    className="flex justify-between items-center p-3 bg-base-200 rounded"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm opacity-70">{user.email}</p>
                    </div>
                    <Link
                      to={`/profile/${user.username}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-primary text-primary-content shadow">
            <div className="card-body">
              <h2 className="card-title">Events Hosted</h2>
              <p className="text-4xl font-bold">{stats.totalEvents}</p>
            </div>
          </div>

          <div className="card bg-secondary text-secondary-content shadow">
            <div className="card-body">
              <h2 className="card-title">Members</h2>
              <p className="text-4xl font-bold">{stats.totalMembers}</p>
            </div>
          </div>

          <div className="card bg-accent text-accent-content shadow">
            <div className="card-body">
              <h2 className="card-title">Attendance</h2>
              <p className="text-4xl font-bold">{stats.totalAttendance}</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-xl">Recent Activities</h2>
            <div className="space-y-3 mt-3">
              {activities.map((event) =>
                event.attendees.map((attendee) => (
                  <div
                    key={`${event.eventId}-${attendee._id}`}
                    className="p-3 bg-base-200 rounded-lg"
                  >
                    {event.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
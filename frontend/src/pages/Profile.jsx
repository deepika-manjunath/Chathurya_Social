import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [username, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar openSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}

      <div className="max-w-5xl mx-auto p-6 mt-4">
        {/* Back Button */}
        <Link to="/dashboard" className="btn btn-sm btn-ghost mb-4">
          ← Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* LEFT SIDE — Avatar + Details */}
              <div className="flex items-center gap-6">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-20">
                    <span className="text-2xl">{user.name.charAt(0)}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="opacity-70">{user.email}</p>
                  <p className="text-sm mt-1 opacity-60">
                    Member of Chathurya Student Developer Club
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE — QR + ID */}
              <div className="flex flex-col items-center md:items-end">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <QRCodeCanvas value={user.memberId} size={200} />
                </div>
                <p className="text-sm mt-2 opacity-70">
                  Member ID: <span className="font-medium">{user.memberId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-6">Events Attended</h2>
            <div className="relative ml-6 max-h-72 overflow-y-auto">
              <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-base-300"></div>
              {user.events.map((event, index) => (
                <div key={index} className="relative flex gap-4 mb-8">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white text-sm z-10">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{event.name}</p>
                    <p className="text-sm opacity-60">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
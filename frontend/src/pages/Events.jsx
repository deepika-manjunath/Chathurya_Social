import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [event, setEvent] = useState({ name: "", date: "" });
  const [eventActive, setEventActive] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [eventId, setEventId] = useState("");
  const [manualId, setManualId] = useState("");

  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const setEventSession = async () => {
    if (!event.name || !event.date) {
      alert("Please fill event details");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events/create",
        { title: event.name, date: event.date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventId(res.data.eventId);
      setEventActive(true);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  useEffect(() => {
    if (!eventActive || !scannerRef.current) return;

    const qrRegionId = scannerRef.current.id;
    html5QrcodeRef.current = new Html5Qrcode(qrRegionId);

    const config = { fps: 10, qrbox: { width: 350, height: 350 } };

    html5QrcodeRef.current
      .start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (attendance.find((a) => a.memberId === decodedText)) return;

          try {
            const res = await axios.post(
              "http://localhost:5000/api/events/attendance",
              { eventId, memberId: decodedText },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setAttendance((prev) => [...prev, res.data.member]);
          } catch (error) {
            console.error("Attendance error:", error);
          }
        },
        (errorMessage) => {
          console.warn("QR Scan error:", errorMessage);
        }
      )
      .catch((err) => console.error("Scanner start failed:", err));

    return () => {
      html5QrcodeRef.current
        ?.stop()
        .then(() => html5QrcodeRef.current.clear())
        .catch((err) => console.error("Scanner cleanup error:", err));
    };
  }, [eventActive, eventId]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualId) return;

    if (attendance.find((a) => a.memberId === manualId)) {
      alert("Member already marked present");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events/attendance",
        { eventId, memberId: manualId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttendance((prev) => [...prev, res.data.member]);
      setManualId("");
    } catch (error) {
      console.error("Manual attendance error:", error);
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar openSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}

      <div className="p-8 max-w-6xl mx-auto space-y-6 mt-4">
        {/* Create Event */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Create Event</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                className="input input-bordered"
                value={event.name}
                onChange={handleChange}
              />
              <input
                type="date"
                name="date"
                className="input input-bordered"
                value={event.date}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary mt-4" onClick={setEventSession}>
              Set Event
            </button>
          </div>
        </div>

        {/* QR Scanner + Attendance */}
        {eventActive && (
          <div className="space-y-6">
            {/* QR Scanner */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">QR Scanner</h2>
                <p className="text-sm opacity-70 mb-4">
                  Event: {event.name} | {event.date}
                </p>
                <div
                  ref={scannerRef}
                  id="qr-reader"
                  style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
                ></div>

                {/* Manual Entry */}
                <div className="mt-6 text-center">
                  <h3 className="text-lg mb-2">Can't scan QR? Enter Member ID:</h3>
                  <form
                    onSubmit={handleManualSubmit}
                    className="flex justify-center gap-2"
                  >
                    <input
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="Enter Member ID"
                      className="input input-bordered"
                    />
                    <button type="submit" className="btn btn-secondary">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Live Attendance */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Live Attendance</h2>
                {attendance.length === 0 && <p className="opacity-60">No attendees yet</p>}
                <div className="space-y-2 mt-2">
                  {attendance.map((user, index) => (
                    <div
                      key={index}
                      className="p-2 bg-base-200 rounded flex justify-between"
                    >
                      <span>{user.name}</span>
                      <span>✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
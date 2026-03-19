import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar openSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}

      <div className="p-8 max-w-5xl mx-auto mt-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-6">
            {/* Logo + Title */}
            <div className="flex items-center gap-6">
              <img
                src="/logo.png"
                alt="Club Logo"
                className="w-24 h-24 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold">
                  Chathurya Student Developer Club
                </h1>
                <p className="opacity-70">Code. Build. Innovate.</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                The Chathurya Student Developer Club (CSDC) is a
                student-driven technical community focused on exploring
                modern technologies, collaborative learning, and practical
                software development. The club provides a platform for
                students to experiment with real-world tools, frameworks,
                and development workflows.
              </p>

              <p>
                Through workshops, hackathons, coding sessions, and
                collaborative projects, members gain hands-on experience
                in areas such as web development, artificial intelligence,
                open-source contribution, and software engineering
                fundamentals.
              </p>

              <p>
                The goal of CSDC is to cultivate a strong developer culture
                where curiosity, experimentation, and problem-solving are
                encouraged. Members are motivated to build meaningful
                projects, share knowledge, and grow as engineers in a
                collaborative environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import bg from "../assets/moon-selection.jpg";

export default function MissionSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-space-950/70" />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-16 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold">
          CHOOSE YOUR <span className="text-moon-blue">MISSION</span>
        </h1>

        <div className="mt-10 grid md:grid-cols-2 gap-6 text-left">
          <button
            onClick={() => navigate("/missions/MOON/prepare")}
            className="rounded-xl border border-slate-700 hover:border-moon-blue bg-space-900/80 backdrop-blur p-6 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-600" />
              <div>
                <p className="font-display text-xl font-bold">MOON MISSION</p>
                <p className="text-xs text-slate-400">LUNAR EXPLORATION</p>
              </div>
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <div>
                <p className="text-slate-400 text-xs">DURATION</p>
                <p className="font-medium">7–21 Days</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">DIFFICULTY</p>
                <p className="font-medium text-moon-blue">●●○○○ Beginner</p>
              </div>
            </div>
            <div className="mt-5 text-right">
              <span className="inline-block px-4 py-2 rounded-md bg-moon-blue text-sm font-medium group-hover:bg-blue-500 transition-colors">
                Select Mission
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate("/missions/MARS/prepare")}
            className="rounded-xl border border-mars-orange/50 hover:border-mars-orange bg-space-900/80 backdrop-blur p-6 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-800" />
              <div>
                <p className="font-display text-xl font-bold">MARS MISSION</p>
                <p className="text-xs text-slate-400">MARS EXPLORATION</p>
              </div>
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <div>
                <p className="text-slate-400 text-xs">DURATION</p>
                <p className="font-medium">30–60 Days</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">DIFFICULTY</p>
                <p className="font-medium text-mars-orange">●●●●○ Intermediate</p>
              </div>
            </div>
            <div className="mt-5 text-right">
              <span className="inline-block px-4 py-2 rounded-md bg-mars-orange text-sm font-medium group-hover:bg-orange-500 transition-colors">
                Select Mission
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import moonBg from "../assets/moon-prep.jpg";
import marsBg from "../assets/hero-mars.jpg";
import client from "../api/client";

const CONFIG = {
  MOON: {
    label: "MOON",
    accent: "text-moon-blue",
    accentBg: "bg-moon-blue hover:bg-blue-500",
    ring: "border-moon-blue",
    durations: [7, 14, 21],
    bg: moonBg,
  },
  MARS: {
    label: "MARS",
    accent: "text-mars-orange",
    accentBg: "bg-mars-orange hover:bg-orange-500",
    ring: "border-mars-orange",
    durations: [30, 45, 60],
    bg: marsBg,
  },
};

const OBJECTIVES = [
  { key: "SURVIVE", label: "Survive" },
  { key: "RESEARCH", label: "Research" },
  { key: "FOOD_PRODUCTION", label: "Food Production" },
];

export default function MissionPrep() {
  const { missionType } = useParams(); // "MOON" | "MARS"
  const cfg = CONFIG[missionType] || CONFIG.MOON;
  const navigate = useNavigate();

  const [crewSize, setCrewSize] = useState(missionType === "MARS" ? 10 : 4);
  const [duration, setDuration] = useState(cfg.durations[0]);
  const [totalWeight, setTotalWeight] = useState(1000);
  const [objectives, setObjectives] = useState(["SURVIVE"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleObjective = (key) => {
    setObjectives((prev) =>
      prev.includes(key) ? prev.filter((o) => o !== key) : [...prev, key]
    );
  };

  const handleContinue = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await client.post("/missions/", {
        mission_type: missionType,
        crew_size: crewSize,
        duration_days: duration,
        total_weight_kg: totalWeight,
        objectives,
        total_units: 1000,
      });
      navigate(`/missions/${data.id}/resources`);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Couldn't start the mission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-24 md:pt-28 grid md:grid-cols-2 min-h-screen">
        <div
          className="hidden md:block bg-cover bg-center"
          style={{ backgroundImage: `url(${cfg.bg})` }}
        />

        <div className="px-6 md:px-12 py-10">
          <h1 className="font-display text-2xl md:text-4xl font-bold">
            PREPARE YOUR <span className={cfg.accent}>{cfg.label} MISSION</span>
          </h1>

          <div className="mt-8 space-y-6 max-w-md">
            <div>
              <label className="text-sm text-slate-300 block mb-1">Crew Size</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCrewSize((c) => Math.max(1, c - 1))}
                  className="w-9 h-9 rounded-md border border-slate-600 hover:border-slate-400"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{crewSize}</span>
                <button
                  onClick={() => setCrewSize((c) => Math.min(20, c + 1))}
                  className="w-9 h-9 rounded-md border border-slate-600 hover:border-slate-400"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-1">Mission Duration</label>
              <div className="flex gap-3">
                {cfg.durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      duration === d
                        ? `${cfg.ring} ${cfg.accent} bg-space-800`
                        : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Total Weight <span className="text-slate-500 text-xs">(max 1200 kg)</span>
              </label>
              <input
                type="number"
                min={100}
                max={1200}
                value={totalWeight}
                onChange={(e) => setTotalWeight(Math.min(1200, Number(e.target.value)))}
                className="w-40 rounded-md bg-space-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">Total resource present for this mission</p>
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-2">Mission Objectives</label>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => toggleObjective(o.key)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      objectives.includes(o.key)
                        ? `${cfg.ring} ${cfg.accent} bg-space-800`
                        : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleContinue}
              disabled={loading || objectives.length === 0}
              className={`w-full sm:w-auto px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-60 ${cfg.accentBg}`}
            >
              {loading ? "Preparing…" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

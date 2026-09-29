import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import moonImg from "../assets/moon-dashboard.jpg";
import marsImg from "../assets/hero-mars.jpg";
import client from "../api/client";

const TOPICS = [
  { code: "POWER", label: "Power" },
  { code: "LIFE_SUPPORT", label: "Life Support" },
  { code: "RADIATION_SHIELDING", label: "Radiation Shielding" },
  { code: "FOOD", label: "Food" },
];

export default function Dashboard() {
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);

  const load = () => client.get(`/missions/${missionId}/`).then(({ data }) => setMission(data));

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);

  if (!mission) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center text-slate-400">
        Loading mission…
      </div>
    );
  }

  const isMars = mission.mission_type === "MARS";
  const accent = isMars ? "text-mars-orange" : "text-moon-blue";
  const baseImg = isMars ? marsImg : moonImg;

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-12 grid md:grid-cols-[260px_1fr_260px] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className={`font-display font-bold text-lg ${accent}`}>{mission.mission_type} MISSION</p>
            <p className="text-xs text-slate-400 mt-1">
              {mission.duration_days} Days · {isMars ? "Intermediate" : "Easy"}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Build and manage a {isMars ? "Martian" : "lunar"} base while balancing power, resource and
              crew safety.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Mission Status</p>
            <p className="text-sm">
              Status: <span className="font-medium">{mission.status}</span>
            </p>
            <p className="text-sm mt-1">Crew size: {mission.crew_size}</p>
            <p className="text-sm mt-1">Weight: {mission.total_weight_kg} kg</p>
          </div>
        </div>

        {/* Center column */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 h-64 md:h-80">
            <img src={baseImg} alt="Mission base" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-space-950/70 rounded px-2 py-1 text-xs">
              {isMars ? "MARS BASE ALPHA" : "LUNAR BASE ALPHA"}
            </div>
            <div className="absolute top-3 right-3 bg-space-950/70 rounded px-2 py-1 text-xs">
              {isMars ? "-63° C" : "-173° C"} · Clear
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">Mission Progress</p>
            <div className="w-full h-2 rounded-full bg-space-800 overflow-hidden">
              <div
                className={`h-full ${isMars ? "bg-mars-orange" : "bg-moon-blue"}`}
                style={{ width: `${mission.mission_progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{mission.mission_progress}% complete</p>

            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {TOPICS.map((t) => (
                <Link
                  key={t.code}
                  to={`/missions/${missionId}/learn/${t.code}`}
                  className="text-sm px-3 py-2 rounded-md border border-slate-700 hover:border-slate-500 flex items-center justify-between"
                >
                  {t.label}
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Resource Levels</p>
              <ul className="text-sm space-y-1">
                <li>⚡ Power: {mission.power_units}</li>
                <li>❤ Life Support: {mission.life_support_units}</li>
                <li>☢ Radiation Shielding: {mission.radiation_shielding_units}</li>
                <li>🌱 Food: {mission.food_units}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Base Systems</p>
              <ul className="text-sm space-y-1 text-slate-300">
                <li>Objectives: {mission.objectives.join(", ") || "—"}</li>
                <li>Total units: {mission.total_units}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Alerts &amp; Notifications</p>
            {mission.mission_progress < 100 ? (
              <p className="text-sm text-amber-400">Complete each topic's quiz to advance the mission.</p>
            ) : (
              <p className="text-sm text-green-400">Mission complete — great work, Commander!</p>
            )}
          </div>

          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Crew</p>
            <p className="text-sm">{mission.crew_size} astronauts assigned</p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Recent Logs</p>
            <ul className="text-xs space-y-2 text-slate-400 max-h-56 overflow-y-auto">
              {mission.logs.length === 0 && <li>No activity yet.</li>}
              {mission.logs.map((log) => (
                <li key={log.id} className="border-b border-slate-800 pb-1">
                  {log.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

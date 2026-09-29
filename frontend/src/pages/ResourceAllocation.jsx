import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import moonBg from "../assets/moon-prep.jpg";
import marsBg from "../assets/hero-mars.jpg";
import client from "../api/client";

const RESOURCES = [
  { key: "power_units", label: "Power", icon: "⚡" },
  { key: "life_support_units", label: "Life Support", icon: "❤" },
  { key: "radiation_shielding_units", label: "Radiation Shielding", icon: "☢" },
  { key: "food_units", label: "Food", icon: "🌱" },
];

export default function ResourceAllocation() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client.get(`/missions/${missionId}/`).then(({ data }) => {
      setMission(data);
      setValues({
        power_units: data.power_units,
        life_support_units: data.life_support_units,
        radiation_shielding_units: data.radiation_shielding_units,
        food_units: data.food_units,
      });
    });
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
  const accentBg = isMars ? "bg-mars-orange hover:bg-orange-500" : "bg-moon-blue hover:bg-blue-500";
  const bg = isMars ? marsBg : moonBg;

  const total = mission.total_units;
  const allocated = Object.values(values).reduce((a, b) => a + Number(b || 0), 0);
  const remaining = total - allocated;

  const handleChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: Number(e.target.value) }));
  };

  const handleSubmit = async () => {
    setError("");
    if (remaining !== 0) {
      setError(`Allocated units must equal total resources exactly (${remaining > 0 ? remaining + " left" : Math.abs(remaining) + " over"}).`);
      return;
    }
    setLoading(true);
    try {
      await client.post(`/missions/${missionId}/allocate-resources/`, values);
      navigate(`/missions/${missionId}/dashboard`);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Couldn't save allocation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950">
      <Navbar />
      <div className="pt-24 md:pt-28 grid md:grid-cols-2 min-h-screen">
        <div className="hidden md:block bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />

        <div className="px-6 md:px-12 py-10">
          <h1 className="font-display text-2xl md:text-4xl font-bold">
            RESOURCE <span className={accent}>ALLOCATION</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Total Resources: <span className="text-white font-medium">{total} Units</span>
            {" — "}
            <span className={remaining === 0 ? "text-green-400" : "text-amber-400"}>
              {remaining === 0 ? "fully allocated" : `${remaining} units remaining`}
            </span>
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-5 max-w-xl">
            {RESOURCES.map((r) => (
              <div key={r.key} className="rounded-lg border border-slate-700 bg-space-900/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span>{r.icon}</span> {r.label}
                  </span>
                  <span className="text-slate-400">{values[r.key]}/{total}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={total}
                  step={10}
                  value={values[r.key] || 0}
                  onChange={handleChange(r.key)}
                  className="w-full mt-3"
                />
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-400 max-w-xl">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-8 px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-60 ${accentBg}`}
          >
            {loading ? "Starting…" : "Continue & Start →"}
          </button>
        </div>
      </div>
    </div>
  );
}
